import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header with skeleton filters */}
      <Header
        login="loading..."
        imageUrl=""
        months={[]}
        selectedMonth=""
        onMonthChange={() => {}}
        sources={[]}
        selectedSource=""
        onSourceChange={() => {}}
      />

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="space-y-6 mt-6">
          {/* Summary Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-4 rounded" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-20 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Daily Attendance Chart Skeleton */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[280px] flex items-center justify-center">
                  <Skeleton className="h-48 w-full" />
                </div>
              </CardContent>
            </Card>

            {/* Sources Breakdown Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart Skeleton */}
              <Card>
                <CardHeader className="pb-3">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-center h-[300px]">
                    <Skeleton className="h-48 w-48 rounded-full" />
                  </div>
                </CardContent>
              </Card>

              {/* Table Skeleton */}
              <Card>
                <CardHeader className="pb-3">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-36" />
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Table Header */}
                    <div className="flex space-x-4">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    {/* Table Rows */}
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex space-x-4">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Daily Attendance Table Skeleton */}
            <Card>
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-56" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Table Header */}
                  <div className="grid grid-cols-5 gap-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  {/* Table Rows */}
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div key={i} className="grid grid-cols-5 gap-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
