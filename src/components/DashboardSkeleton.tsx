import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen gradient-bg">
      {/* Skeleton Header */}
      <header className="glass border-b border-border/50 backdrop-blur-xl sticky top-0 z-50 w-full animate-fade-in-up shadow-lg">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            {/* Logo skeleton - hidden on mobile */}
            <Skeleton className="hidden md:block w-10 h-10 md:w-12 md:h-12 rounded-xl skeleton-glass border border-white/10 shadow-2xl" />
            <Skeleton className="h-8 md:h-10 w-32 md:w-40 rounded-lg skeleton-glass border border-white/10 shadow-sm" />
          </div>

          <div className="flex items-center space-x-4">
            {/* Month Selector skeleton */}
            <div className="flex items-center space-x-2">
              <Skeleton className="w-[140px] h-9 rounded-lg skeleton-glass border border-white/10 shadow-sm" />
            </div>

            {/* Avatar skeleton */}
            <Skeleton className="w-10 h-10 rounded-full skeleton-glass border border-white/10 shadow-sm" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="space-y-8 mt-8 animate-fade-in-up">
          {/* Summary Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="card-modern glass-hover group overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                  <Skeleton className="h-4 w-20 skeleton-glass" />
                  <Skeleton className="h-8 w-8 rounded-lg skeleton-glass" />
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex items-baseline space-x-2">
                    <Skeleton className="h-8 w-16 skeleton-glass" />
                    <Skeleton className="h-3 w-20 skeleton-glass" />
                  </div>
                  <Skeleton className="h-3 w-32 mt-1 skeleton-glass" />

                  {/* Progress Bar Skeleton */}
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-16 skeleton-glass" />
                      <Skeleton className="h-3 w-12 skeleton-glass" />
                    </div>
                    <div className="w-full bg-muted/50 rounded-full h-2">
                      <Skeleton className="h-2 rounded-full skeleton-glass" style={{ width: `${Math.random() * 60 + 20}%` }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Daily Attendance Chart Skeleton */}
          <div className="space-y-8">
            <Card className="card-modern glass-hover group overflow-hidden">
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

            {/* Attendance Calendar and Sessions Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
              {/* Calendar Card Skeleton */}
              <div className="lg:col-span-2">
                <Card className="card-modern glass-hover h-[500px] flex flex-col animate-slide-in-right">
                  <CardHeader className="pb-3">
                    <Skeleton className="h-6 w-48 skeleton-glass" />
                    <Skeleton className="h-4 w-56 skeleton-glass" />
                  </CardHeader>
                  <CardContent className="flex-1 flex items-center justify-center h-full">
                    <div className="space-y-4">
                      {/* Calendar Header */}
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-8 w-24 skeleton-glass" />
                        <div className="flex items-center space-x-2">
                          <Skeleton className="h-8 w-8 rounded skeleton-glass" />
                          <Skeleton className="h-8 w-8 rounded skeleton-glass" />
                        </div>
                      </div>

                      {/* Calendar Grid */}
                      <div className="grid grid-cols-7 gap-1">
                        {/* Day headers */}
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                          <div key={i} className="h-8 flex items-center justify-center">
                            <Skeleton className="h-4 w-4 rounded skeleton-glass" />
                          </div>
                        ))}

                        {/* Calendar days */}
                        {Array.from({ length: 35 }, (_, i) => (
                          <div key={i} className="h-9 w-9 flex items-center justify-center">
                            <Skeleton className="h-7 w-7 rounded skeleton-glass" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sessions Card Skeleton */}
              <div className="lg:col-span-3">
                <Card className="card-modern glass-hover h-[500px] flex flex-col animate-slide-in-right">
                  <CardHeader className="pb-3">
                    <Skeleton className="h-6 w-24 skeleton-glass" />
                    <Skeleton className="h-4 w-48 skeleton-glass" />
                  </CardHeader>
                  <CardContent className="pt-0 flex-1 overflow-auto space-y-4">
                    {/* Daily Totals by Source Skeleton */}
                    <div className='border rounded-md border-border/50 p-3 glass'>
                      <Skeleton className="h-4 w-32 mb-3 skeleton-glass" />
                      <div className="flex flex-wrap gap-4 items-center">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="glass-hover flex items-center gap-2 px-4 py-2 rounded-md bg-muted/30 border border-border/30 backdrop-blur-md">
                            <Skeleton className="h-5 w-16 rounded skeleton-glass" />
                            <Skeleton className="h-4 w-12 skeleton-glass" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Individual Sessions Table Skeleton */}
                    <div className='border rounded-md border-border/50 p-2 glass'>
                      <Skeleton className="h-4 w-36 mb-3 skeleton-glass" />
                      <div className="space-y-3">
                        {/* Table Header */}
                        <div className="grid grid-cols-4 gap-4">
                          <Skeleton className="h-4 w-16 skeleton-glass" />
                          <Skeleton className="h-4 w-12 skeleton-glass" />
                          <Skeleton className="h-4 w-12 skeleton-glass" />
                          <Skeleton className="h-4 w-20 skeleton-glass" />
                        </div>
                        {/* Table Rows */}
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="grid grid-cols-4 gap-4">
                            <Skeleton className="h-6 w-16 rounded skeleton-glass" />
                            <Skeleton className="h-4 w-16 skeleton-glass" />
                            <Skeleton className="h-4 w-16 skeleton-glass" />
                            <Skeleton className="h-4 w-20 skeleton-glass" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
}
