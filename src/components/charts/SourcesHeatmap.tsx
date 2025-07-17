import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { parseISODuration } from "@/lib/utils";
import { AttendanceData } from "@/types/attendance";

interface SourcesHeatmapProps {
  data: AttendanceData;
}

interface DailyData {
  date: string;
  hours: number;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  month: number;
  year: number;
  day: number;
}

export function SourcesHeatmap({
  data,
}: SourcesHeatmapProps) {
  const processAllDailyData = (): DailyData[] => {
    if (!data?.attendance) return [];

    const allDailyData: DailyData[] = [];

    data.attendance.forEach((period) => {
      if (period.entries) {
        const dailyTotals = new Map<string, number>();

        period.entries
          .filter(entry => entry.source !== 'locations')
          .forEach(entry => {
            const date = new Date(entry.time_period.begin_at);
            const dateString = date.toISOString().split('T')[0];

            const beginAt = new Date(entry.time_period.begin_at);
            const endAt = new Date(entry.time_period.end_at);
            const duration = (endAt.getTime() - beginAt.getTime()) / 1000; // duration in seconds

            if (!dailyTotals.has(dateString)) {
              dailyTotals.set(dateString, 0);
            }
            dailyTotals.set(dateString, dailyTotals.get(dateString)! + duration);
          });

        period.daily_attendances.forEach((day) => {
          const date = new Date(day.date);
          const hours = (dailyTotals.get(day.date) || 0) / 3600;

          allDailyData.push({
            date: day.date,
            hours,
            dayOfWeek: date.getDay(),
            month: date.getMonth(),
            year: date.getFullYear(),
            day: date.getDate(),
          });
        });
      } else {
        const filteredDetailedAttendance = period.detailed_attendance.filter(detail => detail.name !== 'locations');
        const totalFilteredDuration = filteredDetailedAttendance.reduce((total, detail) =>
          total + parseISODuration(detail.duration), 0
        );
        const totalOriginalDuration = period.daily_attendances.reduce((total, day) =>
          total + parseISODuration(day.total_attendance), 0
        );

        const scaleRatio = totalOriginalDuration > 0 ? totalFilteredDuration / totalOriginalDuration : 0;

        period.daily_attendances.forEach((day) => {
          const date = new Date(day.date);
          const originalHours = parseISODuration(day.total_attendance) / 3600;
          const hours = originalHours * scaleRatio;

          allDailyData.push({
            date: day.date,
            hours,
            dayOfWeek: date.getDay(),
            month: date.getMonth(),
            year: date.getFullYear(),
            day: date.getDate(),
          });
        });
      }
    });

    const uniqueData = allDailyData.reduce((acc, current) => {
      const existing = acc.find(item => item.date === current.date);
      if (!existing) {
        acc.push(current);
      } else {
        existing.hours += current.hours;
      }
      return acc;
    }, [] as DailyData[]);

    return uniqueData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const dailyData = processAllDailyData();
  const totalHours = dailyData.reduce((sum, day) => sum + day.hours, 0);
  const maxHours = Math.max(...dailyData.map(day => day.hours), 1);

  const getColorIntensity = (hours: number) => {
    const intensity = Math.min(hours / maxHours, 1);
    return intensity;
  };

  const createMonthlyBlocks = () => {
    if (dailyData.length === 0) return [];

    const monthlyData: Record<string, DailyData[]> = {};

    dailyData.forEach(day => {
      const monthKey = `${day.year}-${day.month}`;
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = [];
      }
      monthlyData[monthKey].push(day);
    });

    const monthBlocks = Object.entries(monthlyData)
      .map(([key, days]) => {
        const firstDay = days[0];
        return {
          key,
          year: firstDay.year,
          month: firstDay.month,
          days,
          totalHours: days.reduce((sum, day) => sum + day.hours, 0),
        };
      })
      .sort((a, b) => new Date(a.year, a.month).getTime() - new Date(b.year, b.month).getTime());

    return monthBlocks.slice(-12);
  };

  const createMonthGrid = (monthData: typeof monthBlocks[0]) => {
    const { year, month, days } = monthData;
    const monthName = new Date(year, month).toLocaleDateString('en-US', { month: 'long' });

    // Get the first day of the month and the last day
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

        // Calculate the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
    // Convert to our system where Monday = 0, Sunday = 6
    let firstDayOfWeek = firstDayOfMonth.getDay();
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    // Create a 6x7 grid (6 weeks max, 7 days per week)
    const grid: (DailyData | null)[][] = Array(6).fill(null).map(() => Array(7).fill(null));

    // Fill the grid with all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];

      // Find if we have attendance data for this date
      const dayData = days.find(d => d.date === dateString);

            // Calculate position in the grid
      // firstDayOfWeek tells us where day 1 should start (0-6)
      // day - 1 gives us the offset from day 1
      // firstDayOfWeek + (day - 1) gives us the absolute position
      const absolutePosition = firstDayOfWeek + (day - 1);
      const weekIndex = Math.floor(absolutePosition / 7);
      const dayOfWeek = absolutePosition % 7;

      if (weekIndex < 6) { // Ensure we don't exceed our grid
        if (dayData) {
          grid[weekIndex][dayOfWeek] = dayData;
        } else {
          // Create a placeholder for days without data
          grid[weekIndex][dayOfWeek] = {
            date: dateString,
            hours: 0,
            dayOfWeek: dayOfWeek,
            month: month,
            year: year,
            day: day,
          };
        }
      }
    }

    return { monthName, grid, totalHours: monthData.totalHours, year };
  };

  const monthBlocks = createMonthlyBlocks();
  const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // Calculate date range for subtitle
  const getDateRange = () => {
    if (monthBlocks.length === 0) return '';

    const firstMonth = monthBlocks[0];
    const lastMonth = monthBlocks[monthBlocks.length - 1];

    const firstDate = new Date(firstMonth.year, firstMonth.month, 1);
    const lastDate = new Date(lastMonth.year, lastMonth.month + 1, 0); // Last day of the month

    const firstFormatted = firstDate.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
    const lastFormatted = lastDate.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });

    return `${firstFormatted} - ${lastFormatted}`;
  };

  return (
    <Card className="card-modern glass-hover group overflow-hidden animate-slide-in-right">
      <CardHeader className="pb-4 relative z-10">
        <CardTitle className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Daily Attendance Heatmap
        </CardTitle>
        <CardDescription className="text-muted-foreground/80">
          {Math.round(totalHours / 24)} day{Math.round(totalHours % 24) != 1 ? 's' : ''} {Math.round(totalHours % 24)} hour{Math.round(totalHours % 24) != 1 ? 's' : ''} {Math.round((totalHours % 1) * 60)} minute{Math.round((totalHours % 1) * 60) != 1 ? 's' : ''} total • {getDateRange()}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 relative z-10">
        {dailyData.length > 0 ? (
          <div className="space-y-6">
                        {/* Monthly Calendar Blocks */}
            <div className="grid grid-cols-6 gap-4">
              {monthBlocks.map((monthBlock) => {
                const { monthName, grid, totalHours, year } = createMonthGrid(monthBlock);

                return (
                  <div key={monthBlock.key} className="border rounded-lg border-border/50 p-3 glass">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-foreground/90 text-sm">
                        {monthName} {year} ({totalHours.toFixed(0)}h)
                      </h3>
                    </div>

                    {/* Day names header */}
                    <div className="grid grid-cols-7 gap-0.5 mb-1">
                      {dayNames.map((dayName) => (
                        <div key={dayName} className="text-xs text-muted-foreground text-center font-medium">
                          {dayName}
                        </div>
                      ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-0.5">
                      {grid.map((week, weekIndex) => (
                        week.map((day, dayIndex) => {
                          if (!day) return <div key={`empty-${weekIndex}-${dayIndex}`} className="w-5 h-5" />;

                          const intensity = getColorIntensity(day.hours);
                          const hasData = day.hours > 0;

                          return (
                            <div
                              key={`${day.date}`}
                              className={`w-5 h-5 rounded-[8px] flex items-center justify-center text-xs font-medium transition-all duration-200 hover:scale-110 cursor-pointer group/cell relative ${
                                hasData
                                  ? 'text-white shadow-lg'
                                  : 'text-muted-foreground bg-muted/30'
                              }`}
                              style={{
                                background: hasData
                                  ? `linear-gradient(135deg,
                                      rgba(255, 105, 0, ${0.3 + intensity * 0.7}) 0%,
                                      rgba(255, 105, 0, ${0.2 + intensity * 0.8}) 100%)`
                                  : undefined,
                                border: hasData
                                  ? `1px solid rgba(255, 105, 0, ${0.3 + intensity * 0.4})`
                                  : undefined,
                                boxShadow: hasData
                                  ? `0 2px 8px rgba(255, 105, 0, ${0.2 + intensity * 0.3})`
                                  : undefined,
                              }}
                              title={`${day.date}: ${day.hours.toFixed(1)}h`}
                            >
                              <div>{day.day}</div>

                              {/* Hover tooltip effect */}
                              {hasData && (
                                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 border-border/40 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md grid min-w-[8rem] items-start gap-1.5 rounded-xl border px-3 py-2 text-xs shadow-2xl opacity-0 group-hover/cell:opacity-100 transition-opacity duration-200 pointer-events-none z-10 glass-tooltip">
                                  <div className="font-medium text-foreground text-right">{day.date}</div>
                                  <div className="grid gap-1.5">
                                    <div className="flex w-full flex-wrap items-stretch gap-2">
                                      <div className="flex flex-1 justify-end leading-none">
                                        <span className="text-foreground font-medium">
                                          {(() => {
                                            const hours = Math.floor(day.hours);
                                            const minutes = Math.round((day.hours - hours) * 60);
                                            return `${hours}h ${minutes}m`;
                                          })()}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[320px] text-muted-foreground">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
              <p>
                No daily attendance data available
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
