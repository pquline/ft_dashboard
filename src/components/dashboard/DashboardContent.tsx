import React from "react";
import { AttendanceCalendar } from "@/components/AttendanceCalendar";
import { DashboardSummaryCards } from "@/components/DashboardSummaryCards";
import { DailyAttendanceChart } from "@/components/charts/DailyAttendanceChart";
import { SourcesDistributionChart } from "@/components/charts/SourcesDistributionChart";
import { SourcesDetailsTable } from "@/components/tables/SourcesDetailsTable";
import { getMainMonth } from "@/lib/utils";
import { AttendanceData, AttendancePeriod } from "@/types/attendance";

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
  isLoading,
  isCacheValid,
  lastUpdated,
}: Omit<DashboardContentProps, 'currentPeriod'> & { currentPeriod: AttendancePeriod }) {
  return (
    <div className="container mx-auto px-6 max-w-7xl">
      <div className="space-y-8 mt-8 animate-fade-in-up">
        {/* Cache Status Indicator */}
        {(isCacheValid !== undefined || lastUpdated) && (
          <div className="flex items-center justify-between p-4 bg-white/10 dark:bg-black/10 rounded-lg border border-white/10 backdrop-blur-xl">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isCacheValid ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {isCacheValid ? 'Using cached data' : 'Data may be outdated'}
              </span>
            </div>
            {lastUpdated && (
              <span className="text-xs text-gray-500 dark:text-gray-500">
                Last updated: {new Date(lastUpdated).toLocaleTimeString()}
              </span>
            )}
            {isLoading && (
              <span className="text-xs text-blue-500 animate-pulse">
                Refreshing...
              </span>
            )}
          </div>
        )}

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

          {/* Sources Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SourcesDistributionChart
              sourceData={sourceData}
              currentPeriod={currentPeriod}
            />

            <SourcesDetailsTable
              currentPeriod={currentPeriod}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
