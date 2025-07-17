import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getPeriodMonthName, parseISODuration, formatDuration } from "@/lib/utils";
import { AttendanceData, AttendancePeriod } from "@/types/attendance";

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
  // Process all daily attendance data from all periods
  const processAllDailyData = (): DailyData[] => {
    if (!data?.attendance) return [];

    const allDailyData: DailyData[] = [];

    // Collect all daily attendance data from all periods
    data.attendance.forEach((period) => {
      if (period.daily_attendances) {
        period.daily_attendances.forEach((day) => {
          const date = new Date(day.date);
          const hours = parseISODuration(day.total_attendance) / 3600;

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

    // Remove duplicates and sort by date
    const uniqueData = allDailyData.reduce((acc, current) => {
      const existing = acc.find(item => item.date === current.date);
      if (!existing) {
        acc.push(current);
      } else {
        // If duplicate exists, sum the hours
        existing.hours += current.hours;
      }
      return acc;
    }, [] as DailyData[]);

    return uniqueData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const dailyData = processAllDailyData();
  const totalHours = dailyData.reduce((sum, day) => sum + day.hours, 0);
  const maxHours = Math.max(...dailyData.map(day => day.hours), 1);

  // Get color intensity based on hours
  const getColorIntensity = (hours: number) => {
    const intensity = Math.min(hours / maxHours, 1);
    return intensity;
  };

  // Create separate monthly calendar blocks
  const createMonthlyBlocks = () => {
    if (dailyData.length === 0) return [];

    // Group data by month
    const monthlyData: Record<string, DailyData[]> = {};

    dailyData.forEach(day => {
      const monthKey = `${day.year}-${day.month}`;
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = [];
      }
      monthlyData[monthKey].push(day);
    });

    // Convert to array and sort chronologically
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

    // Take only the last 12 months
    return monthBlocks.slice(-12);
  };

  // Create a calendar grid for a specific month
  const createMonthGrid = (monthData: typeof monthBlocks[0]) => {
    const { year, month, days } = monthData;
    const monthName = new Date(year, month).toLocaleDateString('en-US', { month: 'long' });

    // Find the first day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // Create 7 columns (one for each day of the week, Monday = 0, Sunday = 6)
    const columns: DailyData[][] = Array(7).fill(null).map(() => []);

    // Fill each column with days that fall on that day of the week
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      // Convert Sunday (0) to 6, Monday (1) to 0, etc. to make Monday the first day
      let dayOfWeek = date.getDay();
      dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday = 0, Sunday = 6

      const dateString = date.toISOString().split('T')[0];

      // Find if we have attendance data for this date
      const dayData = days.find(d => d.date === dateString);

      // Create a day object for all days, with 0 hours if no data exists
      const dayObject: DailyData = {
        date: dateString,
        hours: dayData ? dayData.hours : 0,
        dayOfWeek: dayOfWeek,
        month: month,
        year: year,
        day: day,
      };

      // Add the day if it belongs to this month (show all days, even with no data)
      if (date.getMonth() === month) {
        columns[dayOfWeek].push(dayObject);
      }
    }

    // Sort each column by day number to ensure chronological order
    columns.forEach(column => {
      column.sort((a, b) => a.day - b.day);
    });

    return { monthName, columns, totalHours: monthData.totalHours, year };
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
                const { monthName, columns, totalHours, year } = createMonthGrid(monthBlock);

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
                      {columns.map((column, columnIndex) => (
                        <div key={`column-${columnIndex}`} className="flex flex-col gap-0.5">
                          {column.map((day, dayIndex) => {
                            const intensity = getColorIntensity(day.hours);
                            const hasData = day.hours > 0;

                            return (
                              <div
                                key={`${day.date}`}
                                className={`w-6 h-6 rounded-[10px] flex items-center justify-center text-xs font-medium transition-all duration-200 hover:scale-110 cursor-pointer group/cell relative ${
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
                                {day.day}

                                {/* Hover tooltip effect */}
                                {hasData && (
                                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 border-border/40 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md grid min-w-[8rem] items-start gap-1.5 rounded-xl border px-3 py-2 text-xs shadow-2xl opacity-0 group-hover/cell:opacity-100 transition-opacity duration-200 pointer-events-none z-10 glass-tooltip">
                                    <div className="font-medium text-foreground">{day.date}</div>
                                    <div className="grid gap-1.5">
                                      <div className="flex w-full flex-wrap items-stretch gap-2">
                                        <div
                                          className="h-2.5 w-2.5 shrink-0 rounded-[2px] border border-border"
                                          style={{
                                            background: `linear-gradient(135deg,
                                              hsl(var(--primary) / ${0.3 + intensity * 0.7}) 0%,
                                              hsl(var(--primary) / ${0.2 + intensity * 0.8}) 100%)`,
                                            borderColor: `hsl(var(--primary) / ${0.3 + intensity * 0.4})`
                                          }}
                                        />
                                        <div className="flex flex-1 justify-between leading-none">
                                          <div className="grid gap-1.5">
                                            <span className="text-muted-foreground">Attendance</span>
                                          </div>
                                          <span className="text-foreground font-mono font-medium tabular-nums">
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
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="border rounded-lg border-border/50 p-3 glass">
                <div className="text-sm text-muted-foreground mb-1">Average/Day</div>
                <div className="text-lg font-bold text-foreground">
                  {dailyData.filter(day => day.hours > 0).length > 0
                    ? (totalHours / dailyData.filter(day => day.hours > 0).length).toFixed(0)
                    : '0'}h {Math.round((totalHours / dailyData.filter(day => day.hours > 0).length % 1) * 60)}m
                </div>
              </div>
              <div className="border rounded-lg border-border/50 p-3 glass">
                <div className="text-sm text-muted-foreground mb-1">Max/Day</div>
                <div className="text-lg font-bold text-foreground">
                  {maxHours.toFixed(0)}h {Math.round((maxHours % 1) * 60)}m
                </div>
              </div>
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
