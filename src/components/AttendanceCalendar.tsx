'use client';
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDuration } from '@/lib/utils';
import { AttendancePeriod } from '@/types/attendance';

interface AttendanceCalendarProps {
  period: AttendancePeriod;
  selectedSource: string;
  month: Date;
  onMonthChange: (date: Date) => void;
}

interface DayData {
  date: Date;
  total: number;
  onSite: number;
  offSite: number;
  hasSessions: boolean;
}

export function AttendanceCalendar({ period, selectedSource, month, onMonthChange }: AttendanceCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const lastMonthRef = React.useRef<string>('');

  const calendarData = useMemo(() => {
    const { year, month } = getMainMonth(period);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const attendanceMap = new Map<string, { total: number; onSite: number; offSite: number }>();

    period.daily_attendances.forEach(day => {
      const d = new Date(day.date);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const totalOnSite = parseISODuration(day.total_on_site_attendance);
        const totalOffSite = parseISODuration(day.total_off_site_attendance);
        attendanceMap.set(day.date, {
          total: totalOnSite + totalOffSite,
          onSite: totalOnSite,
          offSite: totalOffSite
        });
      }
    });

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
  }, [period]);

      const selectedDateSessions = useMemo(() => {
    if (!selectedDate) return [];

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

        if (!period.entries) {
      return [];
    }

    const daySessions = period.entries.filter(session => {
      const sessionDate = new Date(session.time_period.begin_at);
      const sessionDateString = sessionDate.getFullYear() + '-' +
        String(sessionDate.getMonth() + 1).padStart(2, '0') + '-' +
        String(sessionDate.getDate()).padStart(2, '0');
      return sessionDateString === dateString;
    });

    const filteredSessions = daySessions.filter(session => {
      if (session.source === 'locations') return false;
      if (selectedSource === 'all') return true;
      return session.source === selectedSource;
    });

    const sessions = filteredSessions.map(session => {
      const beginAt = new Date(session.time_period.begin_at);
      const endAt = new Date(session.time_period.end_at);
      const duration = (endAt.getTime() - beginAt.getTime()) / 1000; // duration in seconds

      return {
        type: 'on_site' as const,
        duration,
        source: session.source,
        campusId: session.campus_id,
        beginAt: session.time_period.begin_at,
        endAt: session.time_period.end_at,
      };
    }).filter(session => session.duration > 0);
    return sessions;
  }, [selectedDate, period.entries, selectedSource]);

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

  function parseISODuration(duration: string): number {
    const match = duration.match(/P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?/)
    if (!match) return 0

    const days = parseInt(match[1] || '0')
    const hours = parseInt(match[2] || '0')
    const minutes = parseInt(match[3] || '0')
    const seconds = parseFloat(match[4] || '0')

    return days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds
  }

  React.useEffect(() => {
    const currentMonthKey = `${month.getFullYear()}-${month.getMonth()}`;

    if (currentMonthKey === lastMonthRef.current) {
      return;
    }

    lastMonthRef.current = currentMonthKey;

    const today = new Date();
    const isCurrentMonth = today.getFullYear() === month.getFullYear() && today.getMonth() === month.getMonth();

    if (isCurrentMonth) {
      const todayInCalendar = calendarData.find(day =>
        day.date.getDate() === today.getDate()
      );

      if (todayInCalendar && todayInCalendar.hasSessions) {
        setSelectedDate(todayInCalendar.date);
      } else {
        const firstDayWithSessions = calendarData.find(day => day.hasSessions);
        if (firstDayWithSessions) {
          setSelectedDate(firstDayWithSessions.date);
        } else {
          setSelectedDate(new Date(month.getFullYear(), month.getMonth(), 1));
        }
      }
    } else {
      setSelectedDate(new Date(month.getFullYear(), month.getMonth(), 1));
    }
  }, [month, calendarData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
      {/* Calendar Card */}
      <div className="lg:col-span-2">
        <Card className="h-[450px] flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle>Attendance Calendar</CardTitle>
            <CardDescription>
              {selectedSource === 'all'
                ? 'Click on any day to view session details (All sources)'
                : `Click on any day to view session details (${selectedSource} source)`
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center h-full">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={month}
              onMonthChange={onMonthChange}
              className="rounded-md border"
              classNames={{
                day_selected: "bg-primary text-primary-foreground rounded-full",
                day_today: "",
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
              }}
              components={{
                Day: ({ day, ...props }: { day: { date: Date } } & React.HTMLAttributes<HTMLDivElement>) => {
                  const dayData = calendarData.find(d =>
                    d.date.toDateString() === day.date.toDateString()
                  );
                  return (
                    <div {...props}>
                      <span className="relative w-full h-full flex items-center justify-center">
                        {day.date.getDate()}
                        {dayData?.hasSessions && (
                          <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full" />
                        )}
                      </span>
                    </div>
                  );
                }
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Sessions Card */}
      <div className="lg:col-span-3">
        <Card className="h-[450px] flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle>Sessions</CardTitle>
            <CardDescription>
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
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 flex-1 overflow-auto">
            {selectedDateSessions.length > 0 ? (
              <div className='border rounded-md border-border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source</TableHead>
                      <TableHead>Begin</TableHead>
                      <TableHead>End</TableHead>
                      <TableHead>Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedDateSessions.map((session, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Badge variant="outline">
                            {session.source}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(session.beginAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          })}
                        </TableCell>
                        <TableCell>
                          {new Date(session.endAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          })}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatDuration(session.duration)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-8 text-muted-foreground text-center">
                {selectedDate ? 'No sessions on this day' : 'Select a day to view sessions'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
