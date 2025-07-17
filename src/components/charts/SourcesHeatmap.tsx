import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPeriodMonthName, parseISODuration, formatDuration } from "@/lib/utils";
import { AttendancePeriod } from "@/types/attendance";

interface SourcesHeatmapProps {
  currentPeriod: AttendancePeriod;
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
  currentPeriod,
}: SourcesHeatmapProps) {
  // Process daily attendance data
  const processDailyData = (): DailyData[] => {
    if (!currentPeriod?.daily_attendances) return [];

    return currentPeriod.daily_attendances.map((day) => {
      const date = new Date(day.date);
      const hours = parseISODuration(day.total_attendance) / 3600;

      return {
        date: day.date,
        hours,
        dayOfWeek: date.getDay(),
        month: date.getMonth(),
        year: date.getFullYear(),
        day: date.getDate(),
      };
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const dailyData = processDailyData();
  const totalHours = dailyData.reduce((sum, day) => sum + day.hours, 0);
  const maxHours = Math.max(...dailyData.map(day => day.hours), 1);

  // Get color intensity based on hours
  const getColorIntensity = (hours: number) => {
    const intensity = Math.min(hours / maxHours, 1);
    return intensity;
  };

  // Group data by month
  const groupByMonth = () => {
    const months: Record<string, DailyData[]> = {};

    dailyData.forEach(day => {
      const monthKey = `${day.year}-${day.month}`;
      if (!months[monthKey]) {
        months[monthKey] = [];
      }
      months[monthKey].push(day);
    });

    return Object.entries(months)
      .map(([key, days]) => ({
        key,
        month: days[0].month,
        year: days[0].year,
        days,
        totalHours: days.reduce((sum, day) => sum + day.hours, 0),
      }))
      .sort((a, b) => new Date(a.year, a.month).getTime() - new Date(b.year, b.month).getTime());
  };

  const monthGroups = groupByMonth();

  // Create a grid for each month
  const createMonthGrid = (monthData: typeof monthGroups[0]) => {
    const { days, month, year } = monthData;
    const monthName = new Date(year, month).toLocaleDateString('en-US', { month: 'short' });

    // Create a 7x6 grid (days of week x max weeks in month)
    const grid: (DailyData | null)[][] = Array(7).fill(null).map(() => Array(6).fill(null));

    // Find the first day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    const startDayOfWeek = firstDayOfMonth.getDay();

    // Fill the grid
    days.forEach(day => {
      const weekIndex = Math.floor((day.day - 1 + startDayOfWeek) / 7);
      const dayIndex = day.dayOfWeek;

      if (weekIndex < 6 && dayIndex < 7) {
        grid[dayIndex][weekIndex] = day;
      }
    });

    return { monthName, grid, totalHours: monthData.totalHours };
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card className="card-modern glass-hover group overflow-hidden animate-slide-in-right">
      <CardHeader className="pb-4 relative z-10">
        <CardTitle className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Daily Attendance Heatmap
        </CardTitle>
        <CardDescription className="text-muted-foreground/80">
          Daily attendance patterns • {totalHours.toFixed(1)}h total
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 relative z-10">
        {dailyData.length > 0 ? (
          <div className="space-y-8">
            {/* Month Grids */}
            <div className="space-y-6">
              {monthGroups.map((monthData) => {
                const { monthName, grid, totalHours } = createMonthGrid(monthData);

                return (
                  <div key={monthData.key} className="border rounded-lg border-border/50 p-4 glass">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground/90">
                        {monthName} ({totalHours.toFixed(0)}h)
                      </h3>
                    </div>

                    {/* Day names header */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {dayNames.map((dayName) => (
                        <div key={dayName} className="text-xs text-muted-foreground text-center font-medium">
                          {dayName}
                        </div>
                      ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {grid.map((week, weekIndex) =>
                        week.map((day, dayIndex) => {
                          if (!day) {
                            return (
                              <div
                                key={`${weekIndex}-${dayIndex}`}
                                className="w-8 h-8 rounded-sm bg-muted/20"
                              />
                            );
                          }

                          const intensity = getColorIntensity(day.hours);
                          const hasData = day.hours > 0;

                          return (
                            <div
                              key={`${day.date}`}
                              className={`w-8 h-8 rounded-sm flex items-center justify-center text-xs font-medium transition-all duration-200 hover:scale-110 cursor-pointer group/cell relative ${
                                hasData
                                  ? 'text-white shadow-lg'
                                  : 'text-muted-foreground bg-muted/30'
                              }`}
                              style={{
                                background: hasData
                                  ? `linear-gradient(135deg,
                                      rgba(77, 192, 181, ${0.3 + intensity * 0.7}) 0%,
                                      rgba(77, 192, 181, ${0.2 + intensity * 0.8}) 100%)`
                                  : undefined,
                                border: hasData
                                  ? `1px solid rgba(77, 192, 181, ${0.3 + intensity * 0.4})`
                                  : undefined,
                                boxShadow: hasData
                                  ? `0 2px 8px rgba(77, 192, 181, ${0.2 + intensity * 0.3})`
                                  : undefined,
                              }}
                              title={`${day.date}: ${day.hours.toFixed(1)}h`}
                            >
                              {day.day}

                              {/* Hover tooltip effect */}
                              {hasData && (
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background px-2 py-1 rounded text-xs opacity-0 group-hover/cell:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                  {day.hours.toFixed(1)}h
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="border rounded-lg border-border/50 p-4 glass">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Less</span>
                <div className="flex items-center gap-1">
                  {[0, 0.25, 0.5, 0.75, 1].map((intensity) => (
                    <div
                      key={intensity}
                      className="w-6 h-6 rounded-sm flex items-center justify-center text-xs text-white font-medium"
                      style={{
                        background: `linear-gradient(135deg,
                          rgba(77, 192, 181, ${0.3 + intensity * 0.7}) 0%,
                          rgba(77, 192, 181, ${0.2 + intensity * 0.8}) 100%)`,
                        border: `1px solid rgba(77, 192, 181, ${0.3 + intensity * 0.4})`,
                        boxShadow: `0 2px 8px rgba(77, 192, 181, ${0.2 + intensity * 0.3})`,
                      }}
                    >
                      {intensity === 0 ? '0' : intensity === 1 ? `${maxHours.toFixed(0)}h` : ''}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">More</span>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="border rounded-lg border-border/50 p-3 glass">
                <div className="text-sm text-muted-foreground mb-1">Total Days</div>
                <div className="text-lg font-bold text-foreground">
                  {dailyData.filter(day => day.hours > 0).length}
                </div>
              </div>
              <div className="border rounded-lg border-border/50 p-3 glass">
                <div className="text-sm text-muted-foreground mb-1">Average/Day</div>
                <div className="text-lg font-bold text-foreground">
                  {dailyData.filter(day => day.hours > 0).length > 0
                    ? (totalHours / dailyData.filter(day => day.hours > 0).length).toFixed(1)
                    : '0'}h
                </div>
              </div>
              <div className="border rounded-lg border-border/50 p-3 glass">
                <div className="text-sm text-muted-foreground mb-1">Max Day</div>
                <div className="text-lg font-bold text-foreground">
                  {maxHours.toFixed(1)}h
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
                No daily attendance data available for
                selected month
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
