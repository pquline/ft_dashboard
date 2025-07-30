import { type AttendancePeriod } from "@/types/attendance";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Source priority: sipass > desk-made > discord > others
const SOURCE_PRIORITY: Record<string, number> = {
  'sipass': 3,
  'desk-made': 2,
  'discord': 1,
};

function getSourcePriority(source: string): number {
  return SOURCE_PRIORITY[source] || 0;
}

export function prioritizeSessions(sessions: Array<{ beginAt: string; endAt: string; source: string; duration: number }>) {
  if (sessions.length === 0) return [];
  if (sessions.length === 1) return sessions;

  const sortedSessions = sessions.sort((a, b) => {
    const priorityDiff = getSourcePriority(b.source) - getSourcePriority(a.source);
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(a.beginAt).getTime() - new Date(b.beginAt).getTime();
  });

  const prioritizedSessions: typeof sessions = [];
  const coveredTimeRanges: Array<{ start: number; end: number }> = [];

  for (const session of sortedSessions) {
    const sessionStart = new Date(session.beginAt).getTime();
    const sessionEnd = new Date(session.endAt).getTime();

    // Skip invalid sessions
    if (sessionEnd <= sessionStart) continue;

    let remainingRanges = [{ start: sessionStart, end: sessionEnd }];

    for (const coveredRange of coveredTimeRanges) {
      const newRemainingRanges: Array<{ start: number; end: number }> = [];

      for (const range of remainingRanges) {
        // If no overlap, keep the entire range
        if (range.end <= coveredRange.start || range.start >= coveredRange.end) {
          newRemainingRanges.push(range);
          continue;
        }

        // Split the range around the covered portion
        if (range.start < coveredRange.start) {
          newRemainingRanges.push({ start: range.start, end: coveredRange.start });
        }
        if (range.end > coveredRange.end) {
          newRemainingRanges.push({ start: coveredRange.end, end: range.end });
        }
      }

      remainingRanges = newRemainingRanges;

      // Early exit if no ranges left
      if (remainingRanges.length === 0) break;
    }

    for (const range of remainingRanges) {
      if (range.end > range.start) {
        const duration = (range.end - range.start) / 1000;
        prioritizedSessions.push({
          beginAt: new Date(range.start).toISOString(),
          endAt: new Date(range.end).toISOString(),
          source: session.source,
          duration
        });
      }
    }

    coveredTimeRanges.push({ start: sessionStart, end: sessionEnd });
  }

  return prioritizedSessions;
}

export function parseISODuration(duration: string): number {
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
  const remainingSeconds = Math.floor(seconds % 60)

  if (hours > 0) {
    if (remainingSeconds > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`
    }
    return `${hours}h ${minutes}m`
  }
  if (minutes > 0) {
    if (remainingSeconds > 0) {
      return `${minutes}m ${remainingSeconds}s`
    }
    return `${minutes}m`
  }
  return `${remainingSeconds}s`
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
    .filter(detail => detail.name !== 'locations')
    .reduce((total, detail) => total + parseISODuration(detail.duration), 0)
}

export function calculateOnSiteAttendance(period: AttendancePeriod): number {
  return period.detailed_attendance
    .filter(detail => detail.type === 'on_site' && detail.name !== 'locations')
    .reduce((total, detail) => total + parseISODuration(detail.duration), 0)
}

export function calculateOffSiteAttendance(period: AttendancePeriod): number {
  return period.detailed_attendance
    .filter(detail => detail.type === 'off_site' && detail.name !== 'locations')
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

export function getDailyAttendance(period: AttendancePeriod) {
  if (period.entries) {
    const dailyTotals = new Map<string, { total: number; onSite: number; offSite: number }>();

    const entriesByDate = new Map<string, Array<{ beginAt: string; endAt: string; source: string; duration: number }>>();

    period.entries
      .filter(entry => entry.source !== 'locations')
      .forEach(entry => {
        const date = new Date(entry.time_period.begin_at);
        const dateString = date.getFullYear() + '-' +
          String(date.getMonth() + 1).padStart(2, '0') + '-' +
          String(date.getDate()).padStart(2, '0');

        const beginAt = new Date(entry.time_period.begin_at);
        const endAt = new Date(entry.time_period.end_at);
        const duration = (endAt.getTime() - beginAt.getTime()) / 1000;

        if (!entriesByDate.has(dateString)) {
          entriesByDate.set(dateString, []);
        }

        entriesByDate.get(dateString)!.push({
          beginAt: entry.time_period.begin_at,
          endAt: entry.time_period.end_at,
          source: entry.source,
          duration
        });
      });

    entriesByDate.forEach((entries, dateString) => {
      const prioritizedEntries = prioritizeSessions(entries);

      const totalDuration = prioritizedEntries.reduce((sum, entry) => sum + entry.duration, 0);

      dailyTotals.set(dateString, {
        total: totalDuration,
        onSite: totalDuration,
        offSite: 0
      });
    });

    return period.daily_attendances.map(day => {
      const calculated = dailyTotals.get(day.date) || { total: 0, onSite: 0, offSite: 0 };
      return {
        ...day,
        total: calculated.total,
        onSite: calculated.onSite,
        offSite: calculated.offSite,
      };
    });
  }

  const filteredDetailedAttendance = period.detailed_attendance.filter(detail => detail.name !== 'locations');

  const totalFilteredDuration = filteredDetailedAttendance.reduce((total, detail) =>
    total + parseISODuration(detail.duration), 0
  );

  const totalOriginalDuration = period.daily_attendances.reduce((total, day) =>
    total + parseISODuration(day.total_attendance), 0
  );

  if (totalOriginalDuration === 0 || totalFilteredDuration === 0) {
    return period.daily_attendances.map(day => ({
      ...day,
      total: 0,
      onSite: 0,
      offSite: 0,
    }));
  }

  const scaleRatio = totalFilteredDuration / totalOriginalDuration;

  return period.daily_attendances.map(day => {
    const dayTotal = parseISODuration(day.total_attendance);
    const dayOnSite = parseISODuration(day.total_on_site_attendance);
    const dayOffSite = parseISODuration(day.total_off_site_attendance);

    const scaledTotal = dayTotal * scaleRatio;
    const scaledOnSite = dayOnSite * scaleRatio;
    const scaledOffSite = dayOffSite * scaleRatio;

    return {
      ...day,
      total: scaledTotal,
      onSite: scaledOnSite,
      offSite: scaledOffSite,
    };
  });
}

export function getDailyAttendanceForSource(period: AttendancePeriod, source: string) {
  if (source === 'all') {
    return period.daily_attendances.map(day => ({
      ...day,
      total: parseISODuration(day.total_attendance),
      onSite: parseISODuration(day.total_on_site_attendance),
      offSite: parseISODuration(day.total_off_site_attendance),
    }));
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

// Cookie utility functions
export const setCookie = (name: string, value: string, days: number = 365): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

export const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
	let c = ca[i];
	while (c.charAt(0) === " ") c = c.substring(1, c.length);
	if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const deleteCookie = (name: string): void => {
  try {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=`;
  } catch (error) {
    console.warn('Cookie deletion failed:', error);
  }
};

export const getHolidayMonthKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

export const getHolidayMonthKeyFromPeriod = (period: { from_date: string; to_date: string }): string => {
  const fromDate = new Date(period.from_date);
  return getHolidayMonthKey(fromDate);
};

export const setHolidayDaysCookie = (value: string, monthKey?: string): void => {
  try {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const expires = endOfMonth.toUTCString();

    const cookieKey = monthKey ? `holidayDays-${monthKey}` : 'holidayDays';
    document.cookie = `${cookieKey}=${value};expires=${expires};path=/`;
  } catch (error) {
    console.warn('HolidayDays cookie setting failed:', error);
    const cookieKey = monthKey ? `holidayDays-${monthKey}` : 'holidayDays';
    setCookie(cookieKey, value, 30);
  }
};

export const getHolidayDaysCookie = (monthKey?: string): string | null => {
  const cookieKey = monthKey ? `holidayDays-${monthKey}` : 'holidayDays';
  return getCookie(cookieKey);
};

export const deleteHolidayDaysCookie = (monthKey?: string): void => {
  const cookieKey = monthKey ? `holidayDays-${monthKey}` : 'holidayDays';
  deleteCookie(cookieKey);
};

export const migrateLegacyHolidayData = (): void => {
  try {
    const legacyData = getCookie('holidayDays');
    if (legacyData) {
      const currentMonthKey = getHolidayMonthKey(new Date());
      setHolidayDaysCookie(legacyData, currentMonthKey);
      deleteCookie('holidayDays');
    }
  } catch (error) {
    console.warn('Holiday data migration failed:', error);
  }
};

export const clearAllUserCookies = (): void => {
  deleteCookie('session');
  deleteHolidayDaysCookie();
  try {
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
      const trimmedCookie = cookie.trim();
      if (trimmedCookie.startsWith('holidayDays-')) {
        const cookieName = trimmedCookie.split('=')[0];
        deleteCookie(cookieName);
      }
    });
  } catch (error) {
    console.warn('Failed to clear month-specific holiday cookies:', error);
  }
};

export const sanitizeNumericInput = (value: string): string => {
  return value.replace(/[^0-9]/g, '');
};

export const parsePositiveInteger = (value: string): number => {
  const sanitized = sanitizeNumericInput(value);
  const parsed = parseInt(sanitized, 10);
  return isNaN(parsed) ? 0 : Math.max(0, parsed);
};
