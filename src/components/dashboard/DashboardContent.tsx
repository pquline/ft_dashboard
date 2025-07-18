import React from "react";
import { AttendanceCalendar } from "@/components/AttendanceCalendar";
import { DashboardSummaryCards } from "@/components/DashboardSummaryCards";
import { DailyAttendanceChart } from "@/components/charts/DailyAttendanceChart";
import { getMainMonth } from "@/lib/utils";
import { AttendanceData, AttendancePeriod } from "@/types/attendance";
import { AttendanceHeatmapCard } from "@/components/AttendanceHeatmapCard";

interface DashboardContentProps {
  data: AttendanceData;
  currentPeriod: AttendancePeriod;
  total: string;
  onSite: string;
  offSite: string;
  chartData: Array<{
    date: string;
    attendance: number;
    onSite: number;
    offSite: number;
  }>;
  sourceData: Array<{
    name: string;
    value: number;
    type: "none";
  }>;
  onMonthChange: (newMonth: string) => void;
  isLoading?: boolean;
  isCacheValid?: boolean;
  lastUpdated?: number;
}

export function DashboardContent({
  data,
  currentPeriod,
  total,
  onSite,
  offSite,
  chartData,
  sourceData,
  onMonthChange,
}: Omit<DashboardContentProps, 'currentPeriod'> & { currentPeriod: AttendancePeriod }) {
  return (
    <div className="container mx-auto px-6 max-w-7xl">
      <div className="space-y-8 mt-8 animate-fade-in-up">

        <DashboardSummaryCards
          total={total}
          onSite={onSite}
          offSite={offSite}
          currentPeriod={currentPeriod}
        />

        <div className="space-y-8">
          {/* Daily Attendance Chart */}
          <DailyAttendanceChart
            chartData={chartData}
            currentPeriod={currentPeriod}
          />

          {/* Daily Attendance Calendar */}
          {currentPeriod && (
            <AttendanceCalendar
              period={currentPeriod}
              month={(() => {
                const { year, month } = getMainMonth(currentPeriod);
                return new Date(year, month, 1);
              })()}
              onMonthChange={(date) => {
                const newMonthStr = data.attendance.find((period) => {
                  const { year, month } = getMainMonth(period);
                  return (
                    year === date.getFullYear() && month === date.getMonth()
                  );
                })?.from_date;
                if (newMonthStr) onMonthChange(newMonthStr);
              }}
            />
          )}

          {/* Attendance Heatmap */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AttendanceHeatmapCard data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
