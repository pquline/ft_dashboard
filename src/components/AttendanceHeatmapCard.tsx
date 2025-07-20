"use client"

import React, { useMemo, useCallback, useState, useEffect, useRef } from "react"
import { AttendanceData } from "@/types/attendance";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { formatDuration, getDailyAttendance } from "@/lib/utils";

interface AttendanceHeatmapCardProps {
  data: AttendanceData;
}

const formatSeconds = (seconds: number): string => {
  return formatDuration(seconds)
}

// Pre-compute styles to avoid repeated calculations
const getAttendanceStyle = (seconds: number, maxSeconds: number) => {
  if (seconds === 0) {
    return {
      backgroundColor: 'transparent',
      borderColor: 'rgba(255, 255, 255, 0.05)'
    }
  }

  const intensity = Math.min(seconds / maxSeconds, 1)
  const opacity = Math.max(0.1, Math.min(1, 0.1 + (intensity * 0.9)))
  const borderOpacity = Math.max(0.05, Math.min(0.4, 0.05 + (intensity * 0.35)))

  return {
    backgroundColor: `color-mix(in srgb, var(--primary) ${opacity * 100}%, transparent)`,
    borderColor: `color-mix(in srgb, var(--primary) ${borderOpacity * 250}%, transparent)`,
  }
}

// Memoized day cell component outside to prevent recreation
const DayCell = React.memo(({
  date,
  dateStr,
  seconds,
  maxAttendance,
  formatDate
}: {
  date: Date | null;
  dateStr: string;
  seconds: number;
  maxAttendance: number;
  formatDate: (date: Date) => string;
}) => {
  if (!date) {
    return (
      <div
        className="w-3.5 h-3.5 rounded-[4px] border cursor-pointer transition-all duration-20 hover:scale-110 relative flex items-center justify-center backdrop-blur-sm bg-transparent border-transparent"
      />
    )
  }

  const style = useMemo(() => getAttendanceStyle(seconds, maxAttendance), [seconds, maxAttendance]);
  const title = useMemo(() => `${formatDate(date)}: ${formatSeconds(seconds)} attendance`, [formatDate, date, seconds]);

  return (
    <div
      className="w-3.5 h-3.5 rounded-[4px] border cursor-pointer transition-all duration-20 hover:scale-110 relative flex items-center justify-center backdrop-blur-sm"
      style={style}
      title={title}
    >
      <span className="text-[9px] text-foreground/70 font-medium leading-none">
        {date.getUTCDate()}
      </span>
    </div>
  )
});

DayCell.displayName = 'DayCell';

export function AttendanceHeatmapCard({ data }: AttendanceHeatmapCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDataProcessed, setIsDataProcessed] = useState(false);
  const [processedData, setProcessedData] = useState<{ [key: string]: number }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const attendance = useMemo(() => data.attendance || [], [data.attendance]);

  // Lazy load the heatmap when it comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Process data in chunks to avoid blocking the main thread
  useEffect(() => {
    if (isVisible && !isDataProcessed && attendance.length > 0) {
      const processDataInChunks = () => {
        const dataMap: { [key: string]: number } = {};
        let processedCount = 0;
        const chunkSize = 1; // Process one period at a time

        const processNextChunk = () => {
          const startIndex = processedCount;
          const endIndex = Math.min(startIndex + chunkSize, attendance.length);

          for (let i = startIndex; i < endIndex; i++) {
            const period = attendance[i];
            const processedDailyData = getDailyAttendance(period);

            processedDailyData.forEach(day => {
              const dateStr = day.date;
              const totalSeconds = day.total;
              const cappedSeconds = Math.min(totalSeconds, 86400);

              if (!dataMap[dateStr] || dataMap[dateStr] < cappedSeconds) {
                dataMap[dateStr] = cappedSeconds;
              }
            });
          }

          processedCount = endIndex;

          if (processedCount < attendance.length) {
            // Process next chunk in next frame
            requestAnimationFrame(processNextChunk);
          } else {
            // All data processed
            setProcessedData(dataMap);
            setIsDataProcessed(true);
          }
        };

        processNextChunk();
      };

      // Start processing in next frame
      requestAnimationFrame(processDataInChunks);
    }
  }, [isVisible, isDataProcessed, attendance]);

  const maxAttendance = useMemo(() => {
    const values = Object.values(processedData);
    return values.length > 0 ? Math.max(...values) : 0;
  }, [processedData]);

  const { startDate, endDate } = useMemo(() => {
    if (attendance.length === 0) {
      const today = new Date();
      return {
        startDate: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
        endDate: today
      };
    }

    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth() - 11, 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return { startDate, endDate };
  }, [attendance]);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Memoize the months to display
  const monthsToDisplay = useMemo(() => {
    const monthsToShow: { month: string; year: number; monthIndex: number; actualYear: number }[] = [];

    const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

    while (current <= end) {
      monthsToShow.push({
        month: months[current.getMonth()],
        year: current.getFullYear(),
        monthIndex: current.getMonth(),
        actualYear: current.getFullYear(),
      });
      current.setMonth(current.getMonth() + 1);
    }

    return monthsToShow;
  }, [startDate, endDate, months]);

  // Memoize the grid generation function
  const getMonthGrid = useCallback((year: number, monthIndex: number) => {
    const firstDay = new Date(Date.UTC(year, monthIndex, 1));
    const lastDay = new Date(Date.UTC(year, monthIndex + 1, 0));
    const startDayOfWeek = firstDay.getUTCDay();
    const daysInMonth = lastDay.getUTCDate();

    const grid: (Date | null)[][] = Array(7)
      .fill(null)
      .map(() => []);
    let week = 0;

    for (let i = 0; i < startDayOfWeek; i++) {
      grid[i][week] = null;
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(Date.UTC(year, monthIndex, day));
      const dayOfWeek = (startDayOfWeek + day - 1) % 7;

      if (dayOfWeek === 0 && day > 1) {
        week++;
      }

      if (currentDate >= startDate && currentDate <= endDate) {
        grid[dayOfWeek][week] = currentDate;
      } else {
        grid[dayOfWeek][week] = null;
      }
    }

    return { grid, weeksInMonth: week + 1 };
  }, [startDate, endDate]);

  const formatDate = useCallback((date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC"
    });
  }, []);

  // Memoize the month component to reduce re-renders
  const MonthComponent = useCallback(({ monthInfo }: { monthInfo: { month: string; year: number; monthIndex: number; actualYear: number } }) => {
    const { grid, weeksInMonth } = getMonthGrid(monthInfo.actualYear, monthInfo.monthIndex);

    return (
      <div className="flex flex-col gap-1">
        {/* Month labels */}
        <div className="h-6 flex items-center justify-center text-xs text-gray-500 font-medium">
          {monthInfo.month}
        </div>

        {/* Month grid */}
        <div className="flex gap-1">
          {Array.from({ length: weeksInMonth }, (_, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {grid.map((dayRow, dayIndex) => {
                const date = dayRow[weekIndex];
                // Use UTC date for consistency
                const dateStr = date ?
                  date.getUTCFullYear() + '-' +
                  String(date.getUTCMonth() + 1).padStart(2, '0') + '-' +
                  String(date.getUTCDate()).padStart(2, '0') : "";
                const seconds = date ? processedData[dateStr] || 0 : 0;

                return (
                  <DayCell
                    key={dayIndex}
                    date={date}
                    dateStr={dateStr}
                    seconds={seconds}
                    maxAttendance={maxAttendance}
                    formatDate={formatDate}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }, [getMonthGrid, processedData, maxAttendance, formatDate]);

  return (
    <Card className="card-modern glass-hover group overflow-hidden animate-slide-in-right" ref={containerRef}>
      <CardHeader className="pb-4 relative z-10">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Attendance Heatmap
        </CardTitle>
        <CardDescription className="text-muted-foreground/80">
          {isVisible && isDataProcessed
            ? `Attendance per day (${startDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })})`
            : "Loading attendance data..."
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 relative z-10">
        {!isVisible || !isDataProcessed ? (
          <div className="h-32 flex items-center justify-center">
            <div className="text-muted-foreground">Loading heatmap...</div>
          </div>
        ) : (
          <div className="overflow-x-auto flex justify-center py-4">
            <div className="inline-flex gap-1">
              {/* Calendar grid */}
              {monthsToDisplay.map((monthInfo) => (
                <MonthComponent key={`${monthInfo.actualYear}-${monthInfo.monthIndex}`} monthInfo={monthInfo} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
