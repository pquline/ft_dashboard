"use client"

import { useState, useMemo } from "react"
import { AttendanceData } from "@/types/attendance";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AttendanceHeatmapCardProps {
  data: AttendanceData;
}

// Helper function to convert duration string to minutes
const durationToMinutes = (duration: string): number => {
  const match = duration.match(/(\d+)h\s*(\d+)m/)
  if (match) {
    const hours = parseInt(match[1], 10)
    const minutes = parseInt(match[2], 10)
    return hours * 60 + minutes
  }
  return 0
}

// Helper function to format minutes as hours and minutes
const formatMinutes = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

const getAttendanceColor = (minutes: number) => {
  if (minutes === 0) return "bg-gray-100"
  if (minutes <= 60) return "bg-green-100" // 0-1 hour
  if (minutes <= 240) return "bg-green-200" // 1-4 hours
  if (minutes <= 360) return "bg-green-300" // 4-6 hours
  if (minutes <= 480) return "bg-green-400" // 6-8 hours
  return "bg-green-500" // 8+ hours
}

export function AttendanceHeatmapCard({ data }: AttendanceHeatmapCardProps) {
  const attendance = data.attendance || [];
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)

  // Process attendance data to create a map of date -> total minutes
  const attendanceData = useMemo(() => {
    const dataMap: { [key: string]: number } = {}

    attendance.forEach(period => {
      period.daily_attendances?.forEach(daily => {
        const dateStr = daily.date
        const totalMinutes = durationToMinutes(daily.total_attendance)
        dataMap[dateStr] = (dataMap[dateStr] || 0) + totalMinutes
      })
    })

    return dataMap
  }, [attendance])

  // Calculate start and end dates from the data
  const { startDate, endDate } = useMemo(() => {
    if (attendance.length === 0) {
      const today = new Date()
      return {
        startDate: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
        endDate: today
      }
    }

    let earliestDate = new Date()
    let latestDate = new Date(0)

    attendance.forEach(period => {
      period.daily_attendances?.forEach(daily => {
        const date = new Date(daily.date)
        if (date < earliestDate) earliestDate = date
        if (date > latestDate) latestDate = date
      })
    })

    return { startDate: earliestDate, endDate: latestDate }
  }, [attendance])

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Get only the months that have actual data
  const getMonthsWithData = () => {
    const monthsToShow: { month: string; year: number; monthIndex: number; actualYear: number }[] = []

    // Start from the month of startDate
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

  // Calculate the grid for each month, only showing days with data
  const getMonthGrid = (year: number, monthIndex: number) => {
    const firstDay = new Date(year, monthIndex, 1)
    const lastDay = new Date(year, monthIndex + 1, 0)
    const startDayOfWeek = firstDay.getDay()
    const daysInMonth = lastDay.getDate()

    const grid: (Date | null)[][] = Array(7)
      .fill(null)
      .map(() => [])
    let week = 0

    // Add empty cells for days before the month starts
    for (let i = 0; i < startDayOfWeek; i++) {
      grid[i][week] = null
    }

    // Add days, but only those within our data range
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, monthIndex, day)
      const dayOfWeek = (startDayOfWeek + day - 1) % 7

      if (dayOfWeek === 0 && day > 1) {
        week++
      }

      // Only include dates within our range
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
          Hours spent on campus per day
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 relative z-10">
        <div className="overflow-x-auto">
          <div className="inline-flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-1 mr-2">
              <div className="h-6"></div> {/* Space for month labels */}
              {daysOfWeek.map((day, index) => (
                <div
                  key={day}
                  className="h-3 flex items-center text-xs text-gray-500 w-8"
                  style={{ display: index % 2 === 1 ? "flex" : "none" }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            {monthsToDisplay.map((monthInfo, index) => {
              const { grid, weeksInMonth } = getMonthGrid(monthInfo.actualYear, monthInfo.monthIndex)

              return (
                <div key={`${monthInfo.actualYear}-${monthInfo.monthIndex}`} className="flex flex-col gap-1">
                  {/* Month label */}
                  <div className="h-6 flex items-center justify-center text-xs text-gray-700 font-medium">
                    {monthInfo.month}
                  </div>

                  {/* Month grid */}
                  <div className="flex gap-1">
                    {Array.from({ length: weeksInMonth }, (_, weekIndex) => (
                      <div key={weekIndex} className="flex flex-col gap-1">
                        {grid.map((dayRow, dayIndex) => {
                          const date = dayRow[weekIndex]
                          const dateStr = date?.toISOString().split("T")[0] || ""
                          const minutes = date ? attendanceData[dateStr] || 0 : 0

                          return (
                            <div
                              key={dayIndex}
                              className={`w-3 h-3 rounded-sm border border-gray-200 cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-blue-300 ${
                                date ? getAttendanceColor(minutes) : "bg-transparent border-transparent"
                              }`}
                              onMouseEnter={() => date && setHoveredDate(dateStr)}
                              onMouseLeave={() => setHoveredDate(null)}
                              title={date ? `${formatDate(date)}: ${formatMinutes(minutes)} attendance` : ""}
                            />
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

        {/* Tooltip */}
        {hoveredDate && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
            <div className="text-sm">
              <div className="font-medium text-gray-900">{formatDate(new Date(hoveredDate))}</div>
              <div className="text-gray-600">Attendance: {formatMinutes(attendanceData[hoveredDate] || 0)}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
