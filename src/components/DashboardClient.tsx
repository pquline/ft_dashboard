"use client";
import React from "react";
import { AttendanceData } from "@/types/attendance";
import { useDashboardState } from "@/hooks/useDashboardState";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

export function DashboardClient({
  data,
  defaultMonth,
}: {
  data: AttendanceData;
  defaultMonth: string;
}) {
  const {
    selectedMonth,
    currentPeriod,
    months,
    total,
    onSite,
    offSite,
    chartData,
    sourceData,
    handleMonthChange,
  } = useDashboardState(data, defaultMonth);

  return (
    <DashboardLayout
      data={data}
      months={months}
      selectedMonth={selectedMonth}
      onMonthChange={handleMonthChange}
    >
      {/* Only render DashboardContent if currentPeriod is defined */}
      {currentPeriod && (
        <DashboardContent
          data={data}
          currentPeriod={currentPeriod}
          total={total}
          onSite={onSite}
          offSite={offSite}
          chartData={chartData}
          sourceData={sourceData}
          onMonthChange={handleMonthChange}
        />
      )}
    </DashboardLayout>
  );
}
