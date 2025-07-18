"use client"

import type React from "react"
import { useState } from "react"

interface CalendarHeatmapProps {
  startDate: string;
  endDate: string;
  values: Array<{
    date: string;
    count: number;
  }>;
}

export default function CalendarHeatmap({ startDate, endDate, values = [] }: CalendarHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<{ date: string; value: number } | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Convert values array to date-indexed object for easier lookup
  const data: { [date: string]: number } = {}
  values.forEach(({ date, count }) => {
    data[date] = count
  })

  // Generate days between start and end date
  const generateDays = () => {
    const days = []
    const start = new Date(startDate)
    const end = new Date(endDate)
    const current = new Date(start)

    while (current <= end) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }

    return days
  }

  // Get color intensity based on attendance value
  const getColorIntensity = (value: number) => {
    if (value === 0) return "bg-gray-100"

    // Find max value to normalize colors
    const maxValue = Math.max(...Object.values(data))
    if (maxValue === 0) return "bg-gray-100"

    const intensity = value / maxValue

    if (intensity <= 0.2) return "bg-orange-200"
    if (intensity <= 0.4) return "bg-orange-300"
    if (intensity <= 0.6) return "bg-orange-400"
    if (intensity <= 0.8) return "bg-orange-500"
    return "bg-orange-600"
  }

  // Format date to YYYY-MM-DD
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  // Get day of week (0 = Sunday, 1 = Monday, etc.)
  const getDayOfWeek = (date: Date) => {
    return date.getDay()
  }

  // Group days by weeks
  const groupByWeeks = (days: Date[]) => {
    const weeks: Date[][] = []
    let currentWeek: Date[] = []

    days.forEach((day, index) => {
      if (index === 0) {
        // Fill empty days at the beginning of first week
        const dayOfWeek = getDayOfWeek(day)
        for (let i = 0; i < dayOfWeek; i++) {
          currentWeek.push(new Date(0)) // placeholder date
        }
      }

      currentWeek.push(day)

      if (getDayOfWeek(day) === 6 || index === days.length - 1) {
        // End of week (Saturday) or last day
        weeks.push([...currentWeek])
        currentWeek = []
      }
    })

    return weeks
  }

  const days = generateDays()
  const weeks = groupByWeeks(days)
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const handleMouseEnter = (date: Date, event: React.MouseEvent) => {
    if (date.getTime() === 0) return // Skip placeholder dates

    const dateStr = formatDate(date)
    const value = data[dateStr] || 0
    setHoveredDay({ date: dateStr, value })
    setMousePosition({ x: event.clientX, y: event.clientY })
  }

  const handleMouseLeave = () => {
    setHoveredDay(null)
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY })
  }

  return (
    <div className="p-4">
      <div className="inline-block">
        {/* Month labels */}
        <div className="flex mb-2 ml-8">
          {monthLabels.map((month, index) => (
            <div key={month} className="text-xs text-gray-600 w-10 text-center">
              {index % 3 === 0 ? month : ""}
            </div>
          ))}
        </div>

        <div className="flex">
          {/* Day labels */}
          <div className="flex flex-col mr-2">
            {dayLabels.map((day, index) => (
              <div key={day} className="h-3 w-6 text-xs text-gray-600 flex items-center">
                {index % 2 === 1 ? day : ""}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => {
                  const isPlaceholder = day.getTime() === 0
                  const dateStr = formatDate(day)
                  const value = data[dateStr] || 0

                  return (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-3 h-3 rounded-sm cursor-pointer transition-all hover:ring-1 hover:ring-gray-400 ${
                        isPlaceholder ? "bg-transparent" : getColorIntensity(value)
                      }`}
                      onMouseEnter={(e) => handleMouseEnter(day, e)}
                      onMouseLeave={handleMouseLeave}
                      onMouseMove={handleMouseMove}
                      title={isPlaceholder ? "" : `${dateStr}: ${value} hours`}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between mt-4 text-xs text-gray-600">
          <span>Less</span>
          <div className="flex gap-1 mx-2">
            <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
            <div className="w-3 h-3 bg-orange-200 rounded-sm"></div>
            <div className="w-3 h-3 bg-orange-300 rounded-sm"></div>
            <div className="w-3 h-3 bg-orange-400 rounded-sm"></div>
            <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
            <div className="w-3 h-3 bg-orange-600 rounded-sm"></div>
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredDay && (
        <div
          className="fixed bg-black text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none z-10"
          style={{
            left: mousePosition.x + 10,
            top: mousePosition.y - 30,
          }}
        >
          <div>{hoveredDay.date}</div>
          <div>{hoveredDay.value} hours</div>
        </div>
      )}
    </div>
  )
}
