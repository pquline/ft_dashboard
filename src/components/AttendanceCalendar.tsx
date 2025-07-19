'use client';
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDuration, getPeriodMonthName, prioritizeSessions } from '@/lib/utils';
import { AttendancePeriod } from '@/types/attendance';

interface AttendanceCalendarProps {
  period: AttendancePeriod;
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

export function AttendanceCalendar({ period, month, onMonthChange }: AttendanceCalendarProps) {
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
      return true;
    });

    const sessions = filteredSessions.map(session => {
      const beginAt = new Date(session.time_period.begin_at);
      const endAt = new Date(session.time_period.end_at);
      const duration = (endAt.getTime() - beginAt.getTime()) / 1000;

      return {
        type: 'on_site' as const,
        duration,
        source: session.source,
        campusId: session.campus_id,
        beginAt: session.time_period.begin_at,
        endAt: session.time_period.end_at,
      };
    }).filter(session => session.duration > 0);

    const sessionEntries = sessions.map(session => ({
      beginAt: session.beginAt,
      endAt: session.endAt,
      source: session.source,
      duration: session.duration
    }));

    const prioritizedEntries = prioritizeSessions(sessionEntries);

    const prioritizedSessions = prioritizedEntries.map((entry: { beginAt: string; endAt: string; source: string; duration: number }) => ({
      type: 'on_site' as const,
      duration: entry.duration,
      source: entry.source,
      campusId: 0,
      beginAt: entry.beginAt,
      endAt: entry.endAt,
    }));

    return prioritizedSessions;
  }, [selectedDate, period.entries]);

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
        <Card className="card-modern glass-hover h-[500px] flex flex-col animate-slide-in-right">
          <CardHeader className="pb-3">
            <CardTitle>Attendance Calendar in {getPeriodMonthName(period.from_date, period.to_date)}</CardTitle>
            <CardDescription>
              Click on any day to view session details
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
              disabled={(date) => {
                const currentMonth = month.getMonth();
                const currentYear = month.getFullYear();
                return date.getMonth() !== currentMonth || date.getFullYear() !== currentYear;
              }}
              classNames={{
                day_selected: "bg-primary text-primary-foreground rounded-md",
                day_today: "",
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Sessions Card */}
      <div className="lg:col-span-3">
        <Card className="card-modern glass-hover h-[500px] flex flex-col animate-slide-in-right">
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
          <CardContent className="pt-0 flex-1 overflow-auto space-y-4">
            {selectedDateSessions.length > 0 ? (
              <>
                {/* Daily Totals by Source */}
                <div className='border rounded-md border-border/50 p-3 glass'>
                  <h4 className="text-sm font-semibold text-foreground/80 mb-3 p-2 pb-0">Daily Totals by Source</h4>
                  <div className="flex flex-wrap gap-4 items-center">
                    {(() => {
                      const sourceTotals = selectedDateSessions
                        .filter((session) => session && session.source && typeof session.duration === 'number')
                        .reduce((acc: Record<string, number>, session) => {
                          if (!acc[session.source]) {
                            acc[session.source] = 0;
                          }
                          acc[session.source] += session.duration;
                          return acc;
                        }, {} as Record<string, number>);
                      return Object.entries(sourceTotals).map(([source, totalDuration]) => (
                        <div key={source} className="glass-hover flex items-center gap-2 px-4 py-2 rounded-md bg-muted/30 border border-border/30 backdrop-blur-md">
                          <Badge variant="outline" className="text-xs px-2 py-1 border-orange-500/40 text-orange-500 bg-orange-500/10">{source}</Badge>
                          <span className="text-sm text-foreground ml-1">{formatDuration(totalDuration as number)}</span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                {/* Individual Sessions */}
                <div className='border rounded-md border-border/50 p-2 glass'>
                  <h4 className="text-sm font-semibold text-foreground/80 mb-3 p-2 pb-0">Individual Sessions</h4>
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
                      {selectedDateSessions
                        .filter((session) => session && session.source && typeof session.duration === 'number')
                        .map((session, index: number) => (
                        <TableRow key={index} className="hover:bg-muted/30 transition-colors duration-200">
                          <TableCell>
                            <Badge variant="outline" className="glass-hover">
                              {session.source}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(session.beginAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                              hour12: false
                            })}
                          </TableCell>
                          <TableCell>
                            {new Date(session.endAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
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
              </>
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
