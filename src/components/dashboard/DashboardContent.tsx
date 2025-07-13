import React from "react";
import { AttendanceCalendar } from "@/components/AttendanceCalendar";
import { DashboardSummaryCards } from "@/components/DashboardSummaryCards";
import { DailyAttendanceChart } from "@/components/charts/DailyAttendanceChart";
import { SourcesDistributionChart } from "@/components/charts/SourcesDistributionChart";
import { SourcesDetailsTable } from "@/components/tables/SourcesDetailsTable";
import { getMainMonth } from "@/lib/utils";
import { AttendanceData, SourceType, AttendancePeriod } from "@/types/attendance";

interface DashboardContentProps {
  data: AttendanceData;
  currentPeriod: AttendancePeriod;
  selectedSource: SourceType;
  availableSources: string[];
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
}

export function DashboardContent({
  data,
  currentPeriod,
  selectedSource,
  availableSources,
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
            selectedSource={selectedSource}
            availableSources={availableSources}
          />

          {/* Daily Attendance Calendar */}
          {currentPeriod && (
            <AttendanceCalendar
              period={currentPeriod}
              selectedSource={selectedSource}
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

          {/* Sources Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SourcesDistributionChart
              sourceData={sourceData}
              currentPeriod={currentPeriod}
              selectedSource={selectedSource}
            />

            <SourcesDetailsTable
              currentPeriod={currentPeriod}
              selectedSource={selectedSource}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
