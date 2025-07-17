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

  // Create a single unified grid for all data
  const createUnifiedGrid = () => {
    if (dailyData.length === 0) return { grid: [], monthHeaders: [], yearHeaders: [] };

    const firstDate = new Date(dailyData[0].date);
    const lastDate = new Date(dailyData[dailyData.length - 1].date);

    // Find the first Sunday before or on the first date
    const startDate = new Date(firstDate);
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    // Find the last Saturday after or on the last date
    const endDate = new Date(lastDate);
    const endDayOfWeek = endDate.getDay();
    const daysToAdd = (6 - endDayOfWeek + 7) % 7;
    endDate.setDate(endDate.getDate() + daysToAdd);

    // Calculate the total number of weeks needed
    const totalWeeks = Math.ceil((endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));

    // Create a 7 x totalWeeks grid (7 days of week x number of weeks)
    const grid: (DailyData | null)[][] = Array(7).fill(null).map(() => Array(totalWeeks).fill(null));

    // Fill the grid with all possible dates in the range
    for (let week = 0; week < totalWeeks; week++) {
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        const currentDate = new Date(startDate.getTime() + (week * 7 + dayOfWeek) * 24 * 60 * 60 * 1000);
        const dateString = currentDate.toISOString().split('T')[0];

        // Find if we have data for this date
        const dayData = dailyData.find(day => day.date === dateString);
        if (dayData) {
          grid[dayOfWeek][week] = dayData;
        }
      }
    }

    // Create month headers
    const monthHeaders: { month: string; year: number; weekIndex: number }[] = [];
    let currentMonth = startDate.getMonth();
    let currentYear = startDate.getFullYear();

    for (let week = 0; week < totalWeeks; week++) {
      const weekStartDate = new Date(startDate.getTime() + week * 7 * 24 * 60 * 60 * 1000);
      const weekMonth = weekStartDate.getMonth();
      const weekYear = weekStartDate.getFullYear();

      if (weekMonth !== currentMonth || weekYear !== currentYear) {
        monthHeaders.push({
          month: new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'short' }),
          year: currentYear,
          weekIndex: week
        });
        currentMonth = weekMonth;
        currentYear = weekYear;
      }
    }

    // Add the last month
    monthHeaders.push({
      month: new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'short' }),
      year: currentYear,
      weekIndex: totalWeeks
    });

    // Create year headers
    const yearHeaders: { year: number; weekIndex: number }[] = [];
    let currentYearHeader = startDate.getFullYear();

    for (let week = 0; week < totalWeeks; week++) {
      const weekStartDate = new Date(startDate.getTime() + week * 7 * 24 * 60 * 60 * 1000);
      const weekYear = weekStartDate.getFullYear();

      if (weekYear !== currentYearHeader) {
        yearHeaders.push({
          year: currentYearHeader,
          weekIndex: week
        });
        currentYearHeader = weekYear;
      }
    }

    // Add the last year
    yearHeaders.push({
      year: currentYearHeader,
      weekIndex: totalWeeks
    });

    return { grid, monthHeaders, yearHeaders };
  };

  const { grid, monthHeaders, yearHeaders } = createUnifiedGrid();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
            {/* Year Headers */}
            <div className="flex items-center gap-2">
              {yearHeaders.map((header, index) => (
                <div key={header.year} className="flex items-center">
                  <span className="text-sm font-semibold text-foreground/80 px-2 py-1 rounded bg-muted/30">
                    {header.year}
                  </span>
                  {index < yearHeaders.length - 1 && (
                    <div className="w-4 h-px bg-border mx-2" />
                  )}
                </div>
              ))}
            </div>

            {/* Month Headers */}
            <div className="flex items-center gap-1">
              <div className="w-16" /> {/* Spacer for day names */}
              {monthHeaders.map((header, index) => (
                <div key={`${header.month}-${header.year}-${index}`} className="flex items-center">
                  <span className="text-xs text-muted-foreground px-1">
                    {header.month}
                  </span>
                  {index < monthHeaders.length - 1 && (
                    <div className="w-2 h-px bg-border mx-1" />
                  )}
                </div>
              ))}
            </div>

            {/* Main Heatmap Grid */}
            <div className="border rounded-lg border-border/50 p-4 glass overflow-x-auto">
              <div className="inline-block min-w-full">
                {/* Day names header */}
                <div className="grid grid-cols-7 gap-1 mb-2" style={{ gridTemplateColumns: '4rem repeat(auto-fit, 1.5rem)' }}>
                  {dayNames.map((dayName) => (
                    <div key={dayName} className="text-xs text-muted-foreground text-center font-medium w-16">
                      {dayName}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid gap-1" style={{ gridTemplateColumns: '4rem repeat(auto-fit, 1.5rem)' }}>
                  {grid.map((week, weekIndex) =>
                    week.map((day, dayIndex) => {
                      if (dayIndex === 0) {
                        // Day name column
                        return (
                          <div key={`day-${weekIndex}`} className="text-xs text-muted-foreground text-center font-medium w-16">
                            {dayNames[weekIndex]}
                          </div>
                        );
                      }

                      if (!day) {
                        return (
                          <div
                            key={`${weekIndex}-${dayIndex}`}
                            className="w-6 h-6 rounded-sm bg-muted/20"
                          />
                        );
                      }

                      const intensity = getColorIntensity(day.hours);
                      const hasData = day.hours > 0;

                      return (
                        <div
                          key={`${day.date}`}
                          className={`w-6 h-6 rounded-sm flex items-center justify-center text-xs font-medium transition-all duration-200 hover:scale-110 cursor-pointer group/cell relative ${
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
                <div className="text-sm text-muted-foreground mb-1">Weeks</div>
                <div className="text-lg font-bold text-foreground">
                  {grid[0]?.length || 0}
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
