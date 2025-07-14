import { useState } from "react";
import { AttendanceData } from "@/types/attendance";
import {
  parseISODuration,
  formatDuration,
  getPeriodMonthName,
  filterDailyAttendancesToMainMonth,
} from "@/lib/utils";
import {
  calculateTotalAttendance,
  calculateOnSiteAttendance,
  calculateOffSiteAttendance,
  getDailyAttendance,
} from "@/lib/utils";

export function useDashboardState(
  data: AttendanceData,
  defaultMonth: string
) {
  const [selectedMonth, setSelectedMonth] = useState<string>(defaultMonth);

  const currentPeriod = data.attendance.find(
    (period) => period.from_date === selectedMonth
  );

  const months = data.attendance.map((period) => ({
    value: period.from_date,
    label: getPeriodMonthName(period.from_date, period.to_date),
  }));

  // Calculate summary data
  const total = currentPeriod
    ? formatDuration(calculateTotalAttendance(currentPeriod))
    : "0h 0m";

  const onSite = currentPeriod
    ? formatDuration(calculateOnSiteAttendance(currentPeriod))
    : "0h 0m";

  const offSite = currentPeriod
    ? formatDuration(calculateOffSiteAttendance(currentPeriod))
    : "0h 0m";

  // Get daily attendance data for charts
  let filteredDailyData = currentPeriod
    ? getDailyAttendance(currentPeriod)
    : [];

  if (currentPeriod) {
    filteredDailyData = filterDailyAttendancesToMainMonth(
      currentPeriod,
      filteredDailyData
    );
  }

  const chartData = filteredDailyData.map((day) => ({
    date: new Date(day.date).toLocaleDateString("en-US", { day: "numeric" }),
    attendance: day.total / 3600,
    onSite: day.onSite / 3600,
    offSite: day.offSite / 3600,
  }));

  const sourceData =
    currentPeriod?.detailed_attendance
      .filter((detail) => detail.name !== "locations")
      .map((detail) => ({
        name: detail.name,
        value: parseISODuration(detail.duration) / 3600,
        type: "none" as const,
      })) || [];

  const handleMonthChange = (newMonth: string) => {
    setSelectedMonth(newMonth);
  };

  return {
    selectedMonth,
    currentPeriod,
    months,
    total,
    onSite,
    offSite,
    chartData,
    sourceData,
    handleMonthChange,
  };
}
