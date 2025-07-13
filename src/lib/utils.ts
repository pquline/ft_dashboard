import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { type AttendancePeriod } from "@/types/attendance"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseISODuration(duration: string): number {
  // Handle formats like P1D (1 day), P1DT2H (1 day 2 hours), PT2H30M (2 hours 30 minutes), etc.
  const match = duration.match(/P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?/)
  if (!match) return 0

  const days = parseInt(match[1] || '0')
  const hours = parseInt(match[2] || '0')
  const minutes = parseInt(match[3] || '0')
  const seconds = parseFloat(match[4] || '0')

  return days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

export function formatHours(seconds: number): string {
  const hours = seconds / 3600
  return hours.toFixed(1)
}

export function getMonthName(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function getPeriodMonthName(fromDate: string, toDate: string): string {
  const from = new Date(fromDate)
  const to = new Date(toDate)

  const fromMonth = from.getMonth()
  const toMonth = to.getMonth()
  const fromYear = from.getFullYear()
  const toYear = to.getFullYear()

  if (fromMonth === toMonth && fromYear === toYear) {
    return from.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const daysInFromMonth = new Date(fromYear, fromMonth + 1, 0).getDate()
  const daysFromFromDate = daysInFromMonth - from.getDate() + 1
  const daysToToDate = to.getDate()

  if (daysFromFromDate < daysToToDate) {
    return to.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  } else {
    return from.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }
}

export function getUniqueSources(attendance: AttendancePeriod[]): string[] {
  const sources = new Set<string>()
  attendance.forEach(period => {
    period.from_sources.forEach(source => sources.add(source))
    period.detailed_attendance.forEach(detail => sources.add(detail.name))
  })
  return Array.from(sources).sort()
}

export function calculateTotalAttendance(period: AttendancePeriod): number {
  return period.detailed_attendance
    .reduce((total, detail) => total + parseISODuration(detail.duration), 0)
}

export function calculateOnSiteAttendance(period: AttendancePeriod): number {
  return period.detailed_attendance
    .filter(detail => detail.type === 'on_site')
    .reduce((total, detail) => total + parseISODuration(detail.duration), 0)
}

export function calculateOffSiteAttendance(period: AttendancePeriod): number {
  return period.detailed_attendance
    .filter(detail => detail.type === 'off_site')
    .reduce((total, detail) => total + parseISODuration(detail.duration), 0)
}

export function calculateTotalAttendanceForSource(period: AttendancePeriod, source: string) {
  if (source === 'all') {
    return period.detailed_attendance
      .filter(detail => detail.name !== 'locations')
      .reduce((total, detail) => total + parseISODuration(detail.duration), 0);
  }
  return period.detailed_attendance
    .filter(detail => detail.name === source && detail.name !== 'locations')
    .reduce((total, detail) => total + parseISODuration(detail.duration), 0);
}

export function calculateOnSiteAttendanceForSource(period: AttendancePeriod, source: string) {
  if (source === 'all') {
    return period.detailed_attendance
      .filter(detail => detail.type === 'on_site' && detail.name !== 'locations')
      .reduce((total, detail) => total + parseISODuration(detail.duration), 0);
  }
  return period.detailed_attendance
    .filter(detail => detail.name === source && detail.type === 'on_site' && detail.name !== 'locations')
    .reduce((total, detail) => total + parseISODuration(detail.duration), 0);
}

export function calculateOffSiteAttendanceForSource(period: AttendancePeriod, source: string) {
  if (source === 'all') {
    return period.detailed_attendance
      .filter(detail => detail.type === 'off_site' && detail.name !== 'locations')
      .reduce((total, detail) => total + parseISODuration(detail.duration), 0);
  }
  return period.detailed_attendance
    .filter(detail => detail.name === source && detail.type === 'off_site' && detail.name !== 'locations')
    .reduce((total, detail) => total + parseISODuration(detail.duration), 0);
}

export function getDailyAttendanceForSource(period: AttendancePeriod, source: string) {
  if (source === 'all') {
    // Calculate actual daily attendance from session entries
    const dailyAttendance = new Map<string, { total: number; onSite: number; offSite: number }>();

    // Initialize all days with 0
    period.daily_attendances.forEach(day => {
      dailyAttendance.set(day.date, { total: 0, onSite: 0, offSite: 0 });
    });

    // Calculate actual attendance from session entries, excluding 'locations'
    if (period.entries) {
      period.entries
        .filter(entry => entry.source !== 'locations')
        .forEach(entry => {
          const entryDate = new Date(entry.time_period.begin_at).toISOString().split('T')[0];
          const begin = new Date(entry.time_period.begin_at);
          const end = new Date(entry.time_period.end_at);
          const duration = (end.getTime() - begin.getTime()) / 1000; // duration in seconds

          const dayData = dailyAttendance.get(entryDate);
          if (dayData) {
            dayData.total += duration;
            // Assume all entries are on-site for now (can be refined later)
            dayData.onSite += duration;
          }
        });
    }

    return period.daily_attendances.map(day => {
      const dayData = dailyAttendance.get(day.date) || { total: 0, onSite: 0, offSite: 0 };
      return {
        ...day,
        total: dayData.total,
        onSite: dayData.onSite,
        offSite: dayData.offSite,
      };
    });
  }

  const sourceDetail = period.detailed_attendance.find(detail => detail.name === source);
  if (!sourceDetail) {
    return period.daily_attendances.map(day => ({
      ...day,
      total: 0,
      onSite: 0,
      offSite: 0,
    }));
  }

  const sourceTotalDuration = parseISODuration(sourceDetail.duration);
  const totalMonthDuration = period.daily_attendances.reduce((sum, day) =>
    sum + parseISODuration(day.total_attendance), 0
  );

  if (totalMonthDuration === 0) {
    return period.daily_attendances.map(day => ({
      ...day,
      total: 0,
      onSite: 0,
      offSite: 0,
    }));
  }

  return period.daily_attendances.map(day => {
    const dayTotal = parseISODuration(day.total_attendance);
    const dayRatio = dayTotal / totalMonthDuration;
    const sourceDayTotal = sourceTotalDuration * dayRatio;

    const dayOnSite = parseISODuration(day.total_on_site_attendance);
    const dayOffSite = parseISODuration(day.total_off_site_attendance);
    const dayOnSiteRatio = dayTotal > 0 ? dayOnSite / dayTotal : 0;
    const dayOffSiteRatio = dayTotal > 0 ? dayOffSite / dayTotal : 0;

    return {
      ...day,
      total: sourceDayTotal,
      onSite: sourceDayTotal * dayOnSiteRatio,
      offSite: sourceDayTotal * dayOffSiteRatio,
    };
  });
}

export function getMainMonth(period: AttendancePeriod): { year: number; month: number } {
  const from = new Date(period.from_date);
  const to = new Date(period.to_date);

  const fromMonth = from.getMonth();
  const toMonth = to.getMonth();
  const fromYear = from.getFullYear();
  const toYear = to.getFullYear();

  const daysInFromMonth = new Date(fromYear, fromMonth + 1, 0).getDate();
  const daysFromFromDate = daysInFromMonth - from.getDate() + 1;
  const daysToToDate = to.getDate();

  if (daysFromFromDate < daysToToDate) {
    return { year: toYear, month: toMonth };
  } else {
    return { year: fromYear, month: fromMonth };
  }
}

export function filterDailyAttendancesToMainMonth(period: AttendancePeriod, daily: Array<{ date: string; total: number; onSite: number; offSite: number; day: string; total_attendance: string; total_on_site_attendance: string; total_off_site_attendance: string }>) {
  const { year, month } = getMainMonth(period);
  return daily.filter(day => {
    const d = new Date(day.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
}

function getTimestamp() {
  const now = new Date();
  return now.toLocaleTimeString('fr-FR', { hour12: false });
}

export const devLog = {
  log: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${getTimestamp()}] [LOG]:`, ...args);
    }
  },
  error: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${getTimestamp()}] [ERROR]:`, ...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[${getTimestamp()}] [WARN]:`, ...args);
    }
  },
  info: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.info(`[${getTimestamp()}] [INFO]:`, ...args);
    }
  },
  debug: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[${getTimestamp()}] [DEBUG]:`, ...args);
    }
  }
};
