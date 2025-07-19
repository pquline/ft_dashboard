"use client"

import { useState, useMemo } from "react"
import { AttendanceData } from "@/types/attendance";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { parseISODuration, formatDuration, getDailyAttendance, filterDailyAttendancesToMainMonth } from "@/lib/utils";

interface AttendanceHeatmapCardProps {
  data: AttendanceData;
}

// Helper function to format seconds as hours and minutes
const formatSeconds = (seconds: number): string => {
  return formatDuration(seconds)
}

// Helper function to get gradient color based on attendance intensity
const getAttendanceColor = (seconds: number, maxSeconds: number) => {
  if (seconds === 0) return "bg-gray-100"

  // Calculate intensity as a percentage of the maximum attendance
  const intensity = Math.min(seconds / maxSeconds, 1)

  // Create a smooth gradient from light green to dark green
  // Using CSS custom properties for dynamic color calculation
  const greenIntensity = Math.floor(intensity * 500) // 100 to 500 for green shades
  return `bg-green-${Math.max(100, Math.min(500, greenIntensity))}`
}

// Helper function to get inline style for smooth gradient
const getAttendanceStyle = (seconds: number, maxSeconds: number) => {
  if (seconds === 0) {
    return {
      backgroundColor: 'transparent',
      borderColor: 'rgba(255, 255, 255, 0.05)' // Very subtle white border for 0 attendance
    }
  }

  // Calculate intensity as a percentage of the maximum attendance
  const intensity = Math.min(seconds / maxSeconds, 1)

  // Use primary color with varying opacity
  // More hours = less transparent (higher opacity)
  const opacity = Math.max(0.1, Math.min(1, 0.1 + (intensity * 0.9))) // 0.1 to 1.0 opacity

  // Border opacity also varies with intensity but is lighter overall
  const borderOpacity = Math.max(0.05, Math.min(0.4, 0.05 + (intensity * 0.35))) // 0.05 to 0.4 border opacity

  return {
    backgroundColor: `color-mix(in srgb, var(--primary) ${opacity * 100}%, transparent)`,
    borderColor: `color-mix(in srgb, var(--primary) ${borderOpacity * 250}%, transparent)`,
  }
}

export function AttendanceHeatmapCard({ data }: AttendanceHeatmapCardProps) {
  const attendance = data.attendance || [];
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null)

  // Process attendance data using the same logic as other components
  const attendanceData = useMemo(() => {
    const dataMap: { [key: string]: number } = {}

    console.log("Processing attendance data:", attendance)

    attendance.forEach(period => {
      console.log("Processing period:", period.from_date, "to", period.to_date)

      // Try using the raw daily_attendances first to see what we get
      console.log("Raw daily_attendances:", period.daily_attendances)

      period.daily_attendances?.forEach(day => {
        const dateStr = day.date
        const totalSeconds = parseISODuration(day.total_attendance)
        console.log(`Date: ${dateStr}, Raw duration: ${day.total_attendance}, Seconds: ${totalSeconds}`)

        // For the heatmap, we want to show the highest attendance for each day
        if (!dataMap[dateStr] || dataMap[dateStr] < totalSeconds) {
          dataMap[dateStr] = totalSeconds
        }
      })
    })

    console.log("Final attendance data map:", dataMap)
    return dataMap
  }, [attendance])

  // Calculate the maximum attendance value for gradient scaling
  const maxAttendance = useMemo(() => {
    const values = Object.values(attendanceData)
    return values.length > 0 ? Math.max(...values) : 0
  }, [attendanceData])

  // Calculate start and end dates from all periods
  const { startDate, endDate } = useMemo(() => {
    if (attendance.length === 0) {
      const today = new Date()
      return {
        startDate: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
        endDate: today
      }
    }

    // Start date: one year and one month before today
    const today = new Date()
    const startDate = new Date(today.getFullYear() - 1, today.getMonth() + 1, today.getDate())

    // End date is the latest date from all periods
    let latestDate = new Date(0)
    attendance.forEach(period => {
      const toDate = new Date(period.to_date)
      if (toDate > latestDate) latestDate = toDate
    })

    return { startDate, endDate: latestDate }
  }, [attendance])

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

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
                          const seconds = date ? attendanceData[dateStr] || 0 : 0

                          return (
                            <div
                              key={dayIndex}
                              className={`w-3 h-3 rounded-[3px] border cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-blue-300 ${
                                date ? "" : "bg-transparent border-transparent"
                              }`}
                              style={date ? getAttendanceStyle(seconds, maxAttendance) : {}}
                              onMouseEnter={(e) => {
                                if (date) {
                                  setHoveredDate(dateStr)
                                  setMousePosition({ x: e.clientX, y: e.clientY })
                                }
                              }}
                              onMouseLeave={() => {
                                setHoveredDate(null)
                                setMousePosition(null)
                              }}
                              title={date ? `${formatDate(date)}: ${formatSeconds(seconds)} attendance` : ""}
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
      </CardContent>
    </Card>
  );
}
