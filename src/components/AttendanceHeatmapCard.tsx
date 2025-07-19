"use client"

import { useState, useMemo } from "react"
import { AttendanceData } from "@/types/attendance";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { parseISODuration, formatDuration, getDailyAttendance, filterDailyAttendancesToMainMonth } from "@/lib/utils";

interface AttendanceHeatmapCardProps {
  data: AttendanceData;
}

const formatSeconds = (seconds: number): string => {
  return formatDuration(seconds)
}

const getAttendanceColor = (seconds: number, maxSeconds: number) => {
  if (seconds === 0) return "bg-gray-100"

  const intensity = Math.min(seconds / maxSeconds, 1)

  const greenIntensity = Math.floor(intensity * 500)
  return `bg-green-${Math.max(100, Math.min(500, greenIntensity))}`
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
  const attendance = data.attendance || [];
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null)

  const attendanceData = useMemo(() => {
    const dataMap: { [key: string]: number } = {}

    console.log("Processing attendance data:", attendance)

    attendance.forEach(period => {
      console.log("Processing period:", period.from_date, "to", period.to_date)

      console.log("Raw daily_attendances:", period.daily_attendances)

      period.daily_attendances?.forEach(day => {
        const dateStr = day.date
        const totalSeconds = parseISODuration(day.total_attendance)
        console.log(`Date: ${dateStr}, Raw duration: ${day.total_attendance}, Seconds: ${totalSeconds}`)

        if (!dataMap[dateStr] || dataMap[dateStr] < totalSeconds) {
          dataMap[dateStr] = totalSeconds
        }
      })
    })

    console.log("Final attendance data map:", dataMap)
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
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0) // 0th day of next month = last day of current month

    return { startDate, endDate }
  }, [attendance])

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  // Create a continuous grid for the entire date range
  const getContinuousGrid = () => {
    const grid: (Date | null)[][] = Array(7)
      .fill(null)
      .map(() => [])

    let week = 0
    let currentDate = new Date(startDate)

    // Find the first day of the week that contains our start date
    const firstDayOfWeek = currentDate.getDay()
    for (let i = 0; i < firstDayOfWeek; i++) {
      grid[i][week] = null
    }

    // Fill in all dates from start to end
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay()

      // Start a new week if needed
      if (dayOfWeek === 0 && week > 0) {
        week++
      }

      grid[dayOfWeek][week] = new Date(currentDate)

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return { grid, totalWeeks: week + 1 }
  }

  const { grid: continuousGrid, totalWeeks } = getContinuousGrid()

  // Group the continuous grid by months
  const getMonthGroups = () => {
    const groups: { month: string; year: number; monthIndex: number; startWeek: number; endWeek: number }[] = []

    let currentWeek = 0
    let currentMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
    const endMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1)

    while (currentMonth <= endMonth) {
      const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
      const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

      // Find which weeks this month spans in our continuous grid
      let monthStartWeek = currentWeek
      let monthEndWeek = currentWeek

      // Count weeks until we reach the end of this month
      let tempDate = new Date(monthStart)
      while (tempDate <= monthEnd && tempDate <= endDate) {
        if (tempDate.getDay() === 6) { // Saturday, end of week
          monthEndWeek = currentWeek
          currentWeek++
        }
        tempDate.setDate(tempDate.getDate() + 1)
      }

      groups.push({
        month: months[currentMonth.getMonth()],
        year: currentMonth.getFullYear(),
        monthIndex: currentMonth.getMonth(),
        startWeek: monthStartWeek,
        endWeek: monthEndWeek
      })

      currentMonth.setMonth(currentMonth.getMonth() + 1)
    }

    return groups
  }

  const monthGroups = getMonthGroups()

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
            {monthGroups.map((monthInfo, index) => {
              const { startWeek, endWeek } = monthInfo
              const monthGrid = continuousGrid.slice(startWeek, endWeek + 1)

              return (
                <div key={`${monthInfo.year}-${monthInfo.monthIndex}`} className="flex flex-col gap-1">
                  {/* Month label */}
                  <div className="h-6 flex items-center justify-center text-xs text-gray-700 font-medium">
                    {monthInfo.month}
                  </div>

                  {/* Month grid */}
                  <div className="flex gap-1">
                    {monthGrid.map((dayRow, dayIndex) => (
                      <div key={dayIndex} className="flex flex-col gap-1">
                        {dayRow.map((date, weekIndex) => {
                          const dateStr = date?.toISOString().split("T")[0] || ""
                          const seconds = date ? attendanceData[dateStr] || 0 : 0

                          return (
                            <div
                              key={weekIndex}
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
