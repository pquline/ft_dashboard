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
    const monthName = new Date(year, month).toLocaleDateString('en-US', { month: 'short' });

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

      // Only add the day if it belongs to this month AND has attendance data
      if (date.getMonth() === month && dayData && dayData.hours > 0) {
        columns[dayOfWeek].push(dayData);
      }
    }

    // Sort each column by day number to ensure chronological order
    columns.forEach(column => {
      column.sort((a, b) => a.day - b.day);
    });

    return { monthName, columns, totalHours: monthData.totalHours };
  };

  const monthBlocks = createMonthlyBlocks();
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Calculate date range for subtitle
  const getDateRange = () => {
    if (dailyData.length === 0) return '';

    const firstDate = new Date(dailyData[0].date);
    const lastDate = new Date(dailyData[dailyData.length - 1].date);

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
          All attendance since the beginning • {totalHours.toFixed(1)}h total • {getDateRange()}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 relative z-10">
        {dailyData.length > 0 ? (
          <div className="space-y-6">
            {/* Monthly Calendar Blocks */}
            <div className="space-y-6">
              {monthBlocks.map((monthBlock) => {
                const { monthName, columns, totalHours } = createMonthGrid(monthBlock);

                return (
                  <div key={monthBlock.key} className="border rounded-lg border-border/50 p-4 glass">
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
                      {columns.map((column, columnIndex) => (
                        <div key={`column-${columnIndex}`} className="flex flex-col gap-1">
                          {column.map((day, dayIndex) => {
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
                                        rgba(223, 151, 108, ${0.3 + intensity * 0.7}) 0%,
                                        rgba(223, 151, 108, ${0.2 + intensity * 0.8}) 100%)`
                                    : undefined,
                                  border: hasData
                                    ? `1px solid rgba(223, 151, 108, ${0.3 + intensity * 0.4})`
                                    : undefined,
                                  boxShadow: hasData
                                    ? `0 2px 8px rgba(223, 151, 108, ${0.2 + intensity * 0.3})`
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
                          })}
                        </div>
                      ))}
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
            <div className="grid grid-cols-4 gap-4">
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
              <div className="border rounded-lg border-border/50 p-3 glass">
                <div className="text-sm text-muted-foreground mb-1">Months</div>
                <div className="text-lg font-bold text-foreground">
                  {monthBlocks.length}
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
