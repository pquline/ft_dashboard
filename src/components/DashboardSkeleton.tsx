import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Footer } from '@/components/Footer';

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen gradient-bg">
      {/* Skeleton Header */}
      <header className="card-glass border-b border-white/10 shadow-lg w-full rounded-b-xl mb-6">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Skeleton className="w-8 h-8 md:w-10 md:h-10 rounded-lg card-modern glass-hover border border-white/10 shadow-sm" />
            <Skeleton className="h-8 w-32 rounded-lg card-modern glass-hover border border-white/10 shadow-sm" />
          </div>
          <Skeleton className="w-10 h-10 rounded-full card-modern glass-hover border border-white/10 shadow-sm" />
        </div>
      </header>

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="space-y-6 mt-6">
          {/* Summary Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="card-glass">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-16 skeleton-glass" />
                  <Skeleton className="h-4 w-4 rounded skeleton-glass" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-20 mb-1 skeleton-glass" />
                  <Skeleton className="h-3 w-24 skeleton-glass" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Daily Attendance Chart Skeleton */}
          <div className="space-y-6">
            <Card className="card-glass">
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-40 skeleton-glass" />
                <Skeleton className="h-4 w-64 skeleton-glass" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[280px] flex items-center justify-center">
                  <Skeleton className="h-48 w-full skeleton-glass" />
                </div>
              </CardContent>
            </Card>

            {/* Sources Breakdown Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart Skeleton */}
              <Card className="card-glass">
                <CardHeader className="pb-3">
                  <Skeleton className="h-6 w-40 skeleton-glass" />
                  <Skeleton className="h-4 w-48 skeleton-glass" />
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-center h-[300px]">
                    <Skeleton className="h-48 w-48 rounded-full skeleton-glass" />
                  </div>
                </CardContent>
              </Card>

              {/* Table Skeleton */}
              <Card className="card-glass">
                <CardHeader className="pb-3">
                  <Skeleton className="h-6 w-32 skeleton-glass" />
                  <Skeleton className="h-4 w-36 skeleton-glass" />
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Table Header */}
                    <div className="flex space-x-4">
                      <Skeleton className="h-4 w-16 skeleton-glass" />
                      <Skeleton className="h-4 w-12 skeleton-glass" />
                      <Skeleton className="h-4 w-20 skeleton-glass" />
                    </div>
                    {/* Table Rows */}
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex space-x-4">
                        <Skeleton className="h-4 w-20 skeleton-glass" />
                        <Skeleton className="h-4 w-16 skeleton-glass" />
                        <Skeleton className="h-4 w-24 skeleton-glass" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Daily Attendance Table Skeleton */}
            <Card className="card-glass">
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-48 skeleton-glass" />
                <Skeleton className="h-4 w-56 skeleton-glass" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Table Header */}
                  <div className="grid grid-cols-5 gap-4">
                    <Skeleton className="h-4 w-16 skeleton-glass" />
                    <Skeleton className="h-4 w-12 skeleton-glass" />
                    <Skeleton className="h-4 w-20 skeleton-glass" />
                    <Skeleton className="h-4 w-24 skeleton-glass" />
                    <Skeleton className="h-4 w-20 skeleton-glass" />
                  </div>
                  {/* Table Rows */}
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div key={i} className="grid grid-cols-5 gap-4">
                      <Skeleton className="h-4 w-20 skeleton-glass" />
                      <Skeleton className="h-4 w-16 skeleton-glass" />
                      <Skeleton className="h-4 w-24 skeleton-glass" />
                      <Skeleton className="h-4 w-20 skeleton-glass" />
                      <Skeleton className="h-4 w-16 skeleton-glass" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Footer />
      </div>
    </div>
  );
}
