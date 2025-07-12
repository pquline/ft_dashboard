import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { type AttendancePeriod } from "@/types/attendance"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseISODuration(duration: string): number {
  const match = duration.match(/P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/)
  if (!match) return 0

  const days = parseInt(match[1] || '0')
  const hours = parseInt(match[2] || '0')
  const minutes = parseInt(match[3] || '0')
  const seconds = parseFloat(match[4] || '0')

  return days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

export function formatHours(seconds: number): string {
  const hours = seconds / 3600
  return hours.toFixed(1)
}

export function getMonthName(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function getUniqueSources(attendance: AttendancePeriod[]): string[] {
  const sources = new Set<string>()
  attendance.forEach(period => {
    period.from_sources.forEach(source => sources.add(source))
  })
  return Array.from(sources).sort()
}
