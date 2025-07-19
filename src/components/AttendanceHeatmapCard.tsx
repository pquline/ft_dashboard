"use client"

import { useMemo } from "react"
import { AttendanceData } from "@/types/attendance";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { formatDuration, getDailyAttendance } from "@/lib/utils";

interface AttendanceHeatmapCardProps {
  data: AttendanceData;
}

const formatSeconds = (seconds: number): string => {
  return formatDuration(seconds)
}

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

export function AttendanceHeatmapCard({ data }: AttendanceHeatmapCardProps) {
  const attendance = useMemo(() => data.attendance || [], [data.attendance]);

  const attendanceData = useMemo(() => {
    const dataMap: { [key: string]: number } = {}

    // Debug: Log the number of periods being processed
    console.log(`Heatmap processing ${attendance.length} periods`);

    attendance.forEach(period => {
      // Use the same processed data as the bars chart
      const processedDailyData = getDailyAttendance(period)

      // Debug: Log period info
      console.log(`Period ${period.from_date} to ${period.to_date}: ${processedDailyData.length} days`);

      processedDailyData.forEach(day => {
        const dateStr = day.date
        const totalSeconds = day.total

        // Debug: Log each day being processed
        console.log(`Processing day ${dateStr}: ${totalSeconds}s (${(totalSeconds/3600).toFixed(2)}h)`);

        // Debug logging for production issues
        if (totalSeconds > 86400) {
          console.warn(`High attendance detected for ${dateStr}: ${totalSeconds}s (${(totalSeconds/3600).toFixed(2)}h) from period ${period.from_date} to ${period.to_date}`);
        }

        // Cap at 24 hours (86400 seconds) per day to prevent unrealistic values
        const cappedSeconds = Math.min(totalSeconds, 86400)

        if (!dataMap[dateStr] || dataMap[dateStr] < cappedSeconds) {
          dataMap[dateStr] = cappedSeconds
          console.log(`Stored ${dateStr}: ${cappedSeconds}s (${(cappedSeconds/3600).toFixed(2)}h)`);
        } else {
          console.log(`Skipped ${dateStr}: existing value ${dataMap[dateStr]}s is higher than ${cappedSeconds}s`);
        }
      })
    })

    // Debug: Log final heatmap data
    console.log('Final heatmap data:', Object.entries(dataMap).map(([date, seconds]) => ({
      date,
      hours: (seconds / 3600).toFixed(2),
      seconds
    })).filter(item => item.seconds > 86400));

    // Debug: Log all heatmap data
    console.log('All heatmap data:', Object.entries(dataMap).map(([date, seconds]) => ({
      date,
      hours: (seconds / 3600).toFixed(2),
      seconds
    })));

    // Debug: Log sample dates to check format
    const sampleDates = ['2024-10-04', '2024-10-08', '2024-11-02', '2024-12-01'];
    console.log('Sample date lookups:', sampleDates.map(date => ({
      date,
      found: dataMap[date] || 'NOT FOUND',
      hours: dataMap[date] ? (dataMap[date] / 3600).toFixed(2) : 'N/A'
    })));

    return dataMap
  }, [attendance])

  const maxAttendance = useMemo(() => {
    const values = Object.values(attendanceData)
    return values.length > 0 ? Math.max(...values) : 0
  }, [attendanceData])

  const { startDate, endDate } = useMemo(() => {
    if (attendance.length === 0) {
      const today = new Date()
      return {
        startDate: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
        endDate: today
      }
    }

    const today = new Date()

    const startDate = new Date(today.getFullYear(), today.getMonth() - 11, 1)
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    // Debug: Log the date range being used
    console.log('Heatmap date range:', {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      today: today.toISOString().split('T')[0]
    });

    // Debug: Log what months will be displayed
    const monthsToShow = [];
    const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    while (current <= end) {
      monthsToShow.push(`${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`);
      current.setMonth(current.getMonth() + 1);
    }
    console.log('Months to display:', monthsToShow);

    return { startDate, endDate }
  }, [attendance])

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  const getMonthsWithData = () => {
    const monthsToShow: { month: string; year: number; monthIndex: number; actualYear: number }[] = []

    const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1)

    while (current <= end) {
      monthsToShow.push({
        month: months[current.getMonth()],
        year: current.getFullYear(),
        monthIndex: current.getMonth(),
        actualYear: current.getFullYear(),
      })
      current.setMonth(current.getMonth() + 1)
    }

    return monthsToShow
  }

  const monthsToDisplay = getMonthsWithData()
  const getMonthGrid = (year: number, monthIndex: number) => {
    const firstDay = new Date(year, monthIndex, 1)
    const lastDay = new Date(year, monthIndex + 1, 0)
    const startDayOfWeek = firstDay.getDay()
    const daysInMonth = lastDay.getDate()

    const grid: (Date | null)[][] = Array(7)
      .fill(null)
      .map(() => [])
    let week = 0

    for (let i = 0; i < startDayOfWeek; i++) {
      grid[i][week] = null
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, monthIndex, day)
      const dayOfWeek = (startDayOfWeek + day - 1) % 7

      if (dayOfWeek === 0 && day > 1) {
        week++
      }

      if (currentDate >= startDate && currentDate <= endDate) {
        grid[dayOfWeek][week] = currentDate
      } else {
        grid[dayOfWeek][week] = null
      }
    }

    return { grid, weeksInMonth: week + 1 }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

    return (
    <Card className="card-modern glass-hover group overflow-hidden animate-slide-in-right">
      <CardHeader className="pb-4 relative z-10">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Attendance Heatmap
        </CardTitle>
        <CardDescription className="text-muted-foreground/80">
          Attendance per day ({startDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} - {endDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })})
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 relative z-10">
        <div className="overflow-x-auto flex justify-center py-4">
          <div className="inline-flex gap-1">
            {/* Calendar grid */}
            {monthsToDisplay.map((monthInfo) => {
              const { grid, weeksInMonth } = getMonthGrid(monthInfo.actualYear, monthInfo.monthIndex)

              // Debug: Log what month is being rendered
              console.log(`Rendering month: ${monthInfo.month} ${monthInfo.actualYear} (${monthInfo.actualYear}-${String(monthInfo.monthIndex + 1).padStart(2, '0')})`);

              return (
                <div key={`${monthInfo.actualYear}-${monthInfo.monthIndex}`} className="flex flex-col gap-1">
                  {/* Month labels */}
                  <div className="h-6 flex items-center justify-center text-xs text-gray-500 font-medium">
                    {monthInfo.month}
                  </div>

                  {/* Month grid */}
                  <div className="flex gap-1">
                    {Array.from({ length: weeksInMonth }, (_, weekIndex) => (
                      <div key={weekIndex} className="flex flex-col gap-1">
                        {grid.map((dayRow, dayIndex) => {
                          const date = dayRow[weekIndex]
                          // Use local date instead of UTC to avoid timezone shift
                          const dateStr = date ?
                            date.getFullYear() + '-' +
                            String(date.getMonth() + 1).padStart(2, '0') + '-' +
                            String(date.getDate()).padStart(2, '0') : ""
                          const seconds = date ? attendanceData[dateStr] || 0 : 0

                          // Debug: Log date matching for specific dates
                          if (date && (date.getDate() === 4 || date.getDate() === 8) && date.getMonth() === 9 && date.getFullYear() === 2024) {
                            console.log(`Rendering ${dateStr}: found ${seconds}s (${(seconds/3600).toFixed(2)}h) in attendanceData`);
                          }

                          return (
                            <div
                              key={dayIndex}
                              className={`w-3.5 h-3.5 rounded-[4px] border cursor-pointer transition-all duration-20 hover:scale-110 relative flex items-center justify-center backdrop-blur-sm ${
                                date ? "" : "bg-transparent border-transparent"
                              }`}
                              style={date ? getAttendanceStyle(seconds, maxAttendance) : {}}
                              title={date ? `${formatDate(date)}: ${formatSeconds(seconds)} attendance` : ""}
                            >
                              {date && (
                                <span className="text-[9px] text-foreground/70 font-medium leading-none">
                                  {date.getDate()}
                                </span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
