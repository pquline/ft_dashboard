'use client';
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDuration, getPeriodMonthName } from '@/lib/utils';
import { AttendancePeriod } from '@/types/attendance';
import { CalendarDays, Clock, MapPin } from 'lucide-react';

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
        <Card className="card-modern group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="pb-4 relative z-10">
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-5 w-5 text-green-500" />
              <CardTitle className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Attendance Calendar
              </CardTitle>
            </div>
            <CardDescription className="text-muted-foreground/80">
              {selectedSource === 'all'
                ? 'Click on any day to view session details (All sources)'
                : `Click on any day to view session details (${selectedSource} source)`
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center h-full relative z-10">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={month}
              onMonthChange={onMonthChange}
              className="rounded-lg border border-border/30 bg-card/50 backdrop-blur-sm"
              classNames={{
                day_selected: "bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all duration-200",
                day_today: "bg-accent text-accent-foreground rounded-full border-2 border-primary/50",
                day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-accent/50 transition-all duration-200 rounded-full",
                head_cell: "text-muted-foreground font-medium",
                nav_button: "hover:bg-accent/50 transition-all duration-200",
                nav_button_previous: "hover:bg-accent/50 transition-all duration-200",
                nav_button_next: "hover:bg-accent/50 transition-all duration-200",
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Sessions Card */}
      <div className="lg:col-span-3">
        <Card className="card-modern group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="pb-4 relative z-10">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Sessions
              </CardTitle>
            </div>
            <CardDescription className="text-muted-foreground/80">
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
          <CardContent className="pt-0 flex-1 overflow-auto relative z-10">
            {selectedDateSessions.length > 0 ? (
              <div className='overflow-hidden rounded-lg border border-border/30 bg-card/50 backdrop-blur-sm'>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="font-semibold">Source</TableHead>
                      <TableHead className="font-semibold">Begin</TableHead>
                      <TableHead className="font-semibold">End</TableHead>
                      <TableHead className="font-semibold">Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedDateSessions.map((session, index) => (
                      <TableRow key={index} className="hover:bg-muted/20 transition-colors duration-200">
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-blue-500/10 text-blue-600 border-blue-500/20"
                          >
                            <MapPin className="w-3 h-3 mr-1" />
                            {session.source}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono">
                          {new Date(session.beginAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          })}
                        </TableCell>
                        <TableCell className="font-mono">
                          {new Date(session.endAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          })}
                        </TableCell>
                        <TableCell className="font-mono font-medium text-primary">
                          {formatDuration(session.duration)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                    <span className="text-2xl">📅</span>
                  </div>
                  <p>{selectedDate ? 'No sessions on this day for selected source' : 'Select a day to view sessions'}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
