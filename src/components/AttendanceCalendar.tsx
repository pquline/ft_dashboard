'use client';
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { formatDuration } from '@/lib/utils';
import { AttendancePeriod } from '@/types/attendance';

interface AttendanceCalendarProps {
  period: AttendancePeriod;
  selectedSource: string;
}

interface DayData {
  date: Date;
  total: number;
  onSite: number;
  offSite: number;
  hasSessions: boolean;
}

export function AttendanceCalendar({ period, selectedSource }: AttendanceCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Generate calendar data for the selected month
  const calendarData = useMemo(() => {
    const { year, month } = getMainMonth(period);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month, daysInMonth);

    // Get daily attendance data for the selected source
    const dailyData = getDailyAttendanceForSource(period, selectedSource);
    const filteredDailyData = filterDailyAttendancesToMainMonth(period, dailyData);

    // Create a map of date strings to attendance data
    const attendanceMap = new Map<string, { total: number; onSite: number; offSite: number }>();
    filteredDailyData.forEach(day => {
      attendanceMap.set(day.date, { total: day.total, onSite: day.onSite, offSite: day.offSite });
    });

    // Generate all days in the month
    const days: DayData[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const attendance = attendanceMap.get(dateString);

      days.push({
        date,
        total: attendance?.total || 0,
        onSite: attendance?.onSite || 0,
        offSite: attendance?.offSite || 0,
        hasSessions: (attendance?.total || 0) > 0,
      });
    }

    return days;
  }, [period, selectedSource]);

  // Get sessions for selected date
  const selectedDateSessions = useMemo(() => {
    if (!selectedDate) return [];

    const dateString = selectedDate.toISOString().split('T')[0];
    const dayData = calendarData.find(day =>
      day.date.toISOString().split('T')[0] === dateString
    );

    if (!dayData || dayData.total === 0) return [];

    // Create session entries based on the day's data
    const sessions = [];

    if (dayData.onSite > 0) {
      sessions.push({
        type: 'on_site' as const,
        duration: dayData.onSite,
        source: selectedSource === 'all' ? 'Multiple sources' : selectedSource,
      });
    }

    if (dayData.offSite > 0) {
      sessions.push({
        type: 'off_site' as const,
        duration: dayData.offSite,
        source: selectedSource === 'all' ? 'Multiple sources' : selectedSource,
      });
    }

    return sessions;
  }, [selectedDate, calendarData, selectedSource]);

  // Helper function to get main month (copied from utils)
  function getMainMonth(period: AttendancePeriod): { year: number; month: number } {
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

  // Helper function to get daily attendance for source (copied from utils)
  function getDailyAttendanceForSource(period: AttendancePeriod, source: string) {
    if (source === 'all') {
      const totalWithoutLocations = period.detailed_attendance
        .filter(detail => detail.name !== 'locations')
        .reduce((sum, detail) => sum + parseISODuration(detail.duration), 0);

      const totalWithLocations = period.daily_attendances.reduce((sum, day) =>
        sum + parseISODuration(day.total_attendance), 0
      );

      const scaleFactor = totalWithLocations > 0 ? totalWithoutLocations / totalWithLocations : 0;

      return period.daily_attendances.map(day => ({
        ...day,
        total: parseISODuration(day.total_attendance) * scaleFactor,
        onSite: parseISODuration(day.total_on_site_attendance) * scaleFactor,
        offSite: parseISODuration(day.total_off_site_attendance) * scaleFactor,
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

  // Helper function to filter daily attendances to main month (copied from utils)
  function filterDailyAttendancesToMainMonth(period: AttendancePeriod, daily: Array<{ date: string; total: number; onSite: number; offSite: number; day: string; total_attendance: string; total_on_site_attendance: string; total_off_site_attendance: string }>) {
    const { year, month } = getMainMonth(period);
    return daily.filter(day => {
      const d = new Date(day.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  }

  // Helper function to parse ISO duration (copied from utils)
  function parseISODuration(duration: string): number {
    const match = duration.match(/P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/)
    if (!match) return 0

    const days = parseInt(match[1] || '0')
    const hours = parseInt(match[2] || '0')
    const minutes = parseInt(match[3] || '0')
    const seconds = parseFloat(match[4] || '0')

    return days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds
  }

  // Get the main month for the calendar
  const { year, month } = getMainMonth(period);
  const calendarMonth = new Date(year, month, 1);

  // Auto-select first day with sessions if no date is selected
  React.useEffect(() => {
    if (!selectedDate) {
      const firstDayWithSessions = calendarData.find(day => day.hasSessions);
      if (firstDayWithSessions) {
        setSelectedDate(firstDayWithSessions.date);
      } else {
        // If no days have sessions, select today's date if it's in the current month
        const today = new Date();
        if (today.getFullYear() === year && today.getMonth() === month) {
          setSelectedDate(today);
        } else {
          // Otherwise select the first day of the month
          setSelectedDate(new Date(year, month, 1));
        }
      }
    }
  }, [calendarData, selectedDate, year, month]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Daily Attendance Details</CardTitle>
        <CardDescription>
          {selectedSource === 'all'
            ? 'Click on any day to view session details (All sources)'
            : `Click on any day to view session details (${selectedSource.charAt(0).toUpperCase() + selectedSource.slice(1)} source)`
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={calendarMonth}
              className="rounded-md border"
              classNames={{
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
              }}
                             components={{
                 DayContent: ({ date, ...props }: { date: Date; [key: string]: any }) => {
                   const dayData = calendarData.find(day =>
                     day.date.toDateString() === date.toDateString()
                   );

                   if (!dayData) return <div {...props} />;

                   return (
                     <div
                       {...props}
                       className={`relative h-9 w-9 flex items-center justify-center ${
                         dayData.hasSessions
                           ? 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                           : ''
                       }`}
                     >
                       {date.getDate()}
                       {dayData.hasSessions && (
                         <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full" />
                       )}
                     </div>
                   );
                 }
               }}
            />
          </div>

          {/* Selected Day Sessions */}
          <div>
            <h3 className="font-semibold mb-3">
              {selectedDate ? (
                <>
                  Sessions for {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </>
              ) : (
                'Select a day to view sessions'
              )}
            </h3>

            {selectedDateSessions.length > 0 ? (
              <div className="space-y-3">
                {selectedDateSessions.map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant={session.type === 'on_site' ? 'secondary' : 'outline'}>
                        {session.type === 'on_site' ? 'On Campus' : 'Remote'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {session.source}
                      </span>
                    </div>
                    <span className="font-medium">
                      {formatDuration(session.duration)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {selectedDate ? 'No sessions on this day' : 'Select a day to view sessions'}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
