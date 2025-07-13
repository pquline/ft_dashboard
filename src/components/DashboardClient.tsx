"use client";
import React from "react";
import { AttendanceData } from "@/types/attendance";
import { useDashboardState } from "@/hooks/useDashboardState";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

export function DashboardClient({
  data,
  defaultMonth,
  availableSources,
}: {
  data: AttendanceData;
  defaultMonth: string;
  availableSources: string[];
}) {
  const {
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
  } = useDashboardState(data, defaultMonth, availableSources);

  return (
    <DashboardLayout
      data={data}
      months={months}
      selectedMonth={selectedMonth}
      availableSources={availableSources}
      selectedSource={selectedSource}
      onMonthChange={handleMonthChange}
      onSourceChange={handleSourceChange}
    >
      <DashboardContent
        data={data}
        currentPeriod={currentPeriod}
        selectedSource={selectedSource}
        availableSources={availableSources}
        total={total}
        onSite={onSite}
        offSite={offSite}
        chartData={chartData}
        sourceData={sourceData}
        onMonthChange={handleMonthChange}
      />
    </DashboardLayout>
  );
}
