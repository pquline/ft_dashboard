"use client";

import { useEffect, useState } from 'react';
import { AttendanceData } from '@/types/attendance';
import { useCachedData } from '@/hooks/useCachedData';
import { useDashboardState } from '@/hooks/useDashboardState';
import { DashboardContent } from '@/components/dashboard';
import { DashboardLayout } from '@/components/layout';

interface CachedDashboardClientProps {
  initialData: AttendanceData;
  defaultMonth: string;
  login: string;
  imageUrl: string;
}

export function CachedDashboardClient({
  initialData,
  defaultMonth,
  login,
  imageUrl,
}: CachedDashboardClientProps) {
  const {
    data,
    isLoading,
    error,
    isCacheValid,
    lastUpdated,
    getData,
    refreshData,
  } = useCachedData();

  const [currentData, setCurrentData] = useState<AttendanceData>(initialData);
  const [sessionCookie, setSessionCookie] = useState<string>('');

  // Get session cookie on mount
  useEffect(() => {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('session='))
      ?.split('=')[1];

    if (cookie) {
      setSessionCookie(cookie);
    }
  }, []);

  // Initialize data from cache or initial data
  useEffect(() => {
    if (data) {
      setCurrentData(data);
    } else if (initialData) {
      setCurrentData(initialData);
    }
  }, [data, initialData]);

  // Load data on mount if we have session cookie
  useEffect(() => {
    if (sessionCookie) {
      getData(sessionCookie).then(setCurrentData).catch(console.error);
    }
  }, [sessionCookie, getData]);

  const handleRefresh = async () => {
    if (sessionCookie) {
      await refreshData(sessionCookie);
    }
  };

  const dashboardState = useDashboardState(currentData, defaultMonth);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Refreshing...' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardState.currentPeriod) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">No Data Available</h2>
          <p className="text-gray-500 mb-4">No attendance data found for the selected period.</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      data={currentData}
      months={dashboardState.months}
      selectedMonth={dashboardState.selectedMonth}
      onMonthChange={dashboardState.handleMonthChange}
      onRefresh={handleRefresh}
      isRefreshing={isLoading}
    >
      <DashboardContent
        data={currentData}
        currentPeriod={dashboardState.currentPeriod}
        total={dashboardState.total}
        onSite={dashboardState.onSite}
        offSite={dashboardState.offSite}
        chartData={dashboardState.chartData}
        sourceData={dashboardState.sourceData}
        onMonthChange={dashboardState.handleMonthChange}
        isLoading={isLoading}
        isCacheValid={isCacheValid}
        lastUpdated={lastUpdated}
      />
    </DashboardLayout>
  );
}
