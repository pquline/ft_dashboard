import { useState, useEffect } from "react";
import { AttendanceData, SourceType } from "@/types/attendance";
import {
  parseISODuration,
  formatDuration,
  getPeriodMonthName,
  filterDailyAttendancesToMainMonth,
} from "@/lib/utils";
import {
  calculateTotalAttendanceForSource,
  calculateOnSiteAttendanceForSource,
  calculateOffSiteAttendanceForSource,
  getDailyAttendanceForSource,
} from "@/lib/utils";

export function useDashboardState(
  data: AttendanceData,
  defaultMonth: string,
  availableSources: string[]
) {
  const [selectedMonth, setSelectedMonth] = useState<string>(defaultMonth);
  const [selectedSource, setSelectedSource] = useState<SourceType>("all");

  // Reset selected source if it's no longer available
  useEffect(() => {
    if (data && selectedMonth && selectedSource !== "all") {
      const available = availableSources.filter(
        (source) => source !== "locations"
      );
      if (!available.includes(selectedSource)) {
        setSelectedSource("all");
      }
    }
  }, [data, selectedMonth, selectedSource, availableSources]);

  const currentPeriod = data.attendance.find(
    (period) => period.from_date === selectedMonth
  );

  const months = data.attendance.map((period) => ({
    value: period.from_date,
    label: getPeriodMonthName(period.from_date, period.to_date),
  }));

  // Calculate summary data
  const total = currentPeriod
    ? formatDuration(
        calculateTotalAttendanceForSource(currentPeriod, selectedSource)
      )
    : "0h 0m";

  const onSite = currentPeriod
    ? formatDuration(
        calculateOnSiteAttendanceForSource(currentPeriod, selectedSource)
      )
    : "0h 0m";

  const offSite = currentPeriod
    ? formatDuration(
        calculateOffSiteAttendanceForSource(currentPeriod, selectedSource)
      )
    : "0h 0m";

  // Get daily attendance data for charts
  let filteredDailyData = currentPeriod
    ? getDailyAttendanceForSource(currentPeriod, selectedSource)
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

  // Get source data for pie chart and table
  const sourceData =
    currentPeriod?.detailed_attendance
      .filter((detail) => {
        if (detail.name === "locations") return false;
        if (selectedSource === "all") return true;
        return detail.name === selectedSource;
      })
      .map((detail) => ({
        name: detail.name,
        value: parseISODuration(detail.duration) / 3600,
        type: "none" as const,
      })) || [];

  const handleMonthChange = (newMonth: string) => {
    setSelectedMonth(newMonth);
  };

  const handleSourceChange = (value: string) => {
    setSelectedSource(value as SourceType);
  };

  return {
    selectedMonth,
    selectedSource,
    currentPeriod,
    months,
    total,
    onSite,
    offSite,
    chartData,
    sourceData,
    handleMonthChange,
    handleSourceChange,
  };
}
