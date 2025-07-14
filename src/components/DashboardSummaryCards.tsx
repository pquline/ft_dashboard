import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin, Wifi } from 'lucide-react';
import { getPeriodMonthName } from '@/lib/utils';
import { AttendancePeriod } from '@/types/attendance';

interface DashboardSummaryCardsProps {
  total: string;
  onSite: string;
  offSite: string;
  currentPeriod?: AttendancePeriod;
}

export function DashboardSummaryCards({ total, onSite, offSite, currentPeriod }: DashboardSummaryCardsProps) {
  // Parse time values for comparison
  const parseTime = (timeStr: string) => {
    const match = timeStr.match(/(\d+)h\s*(\d+)m/);
    if (match) {
      return parseInt(match[1]) * 60 + parseInt(match[2]);
    }
    return 0;
  };

  const totalMinutes = parseTime(total);
  const onSiteMinutes = parseTime(onSite);
  const offSiteMinutes = parseTime(offSite);

  // Calculate percentages for visual indicators
  const totalHours = totalMinutes / 60;
  const onSitePercentage = totalMinutes > 0 ? (onSiteMinutes / totalMinutes) * 100 : 0;
  const offSitePercentage = totalMinutes > 0 ? (offSiteMinutes / totalMinutes) * 100 : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-in-up">
      {/* Total Hours Card */}
      <Card className="card-modern glass-hover group overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
          <CardTitle className="text-sm font-semibold text-foreground/80">Total Hours</CardTitle>
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
            <Clock className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex items-baseline space-x-2">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {total}
            </div>
            <div className="text-xs mt-1 text-primary">
              {((totalHours / 140) * 100).toFixed(0)}% of 140 hours
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {currentPeriod ? getPeriodMonthName(currentPeriod.from_date, currentPeriod.to_date) : 'Selected month'}
          </p>
          <div className="mt-3 w-full bg-muted/50 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((totalHours / 140) * 100, 100)}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* On Campus Card */}
      <Card className="card-modern glass-hover group overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
          <CardTitle className="text-sm font-semibold text-foreground/80">On Campus</CardTitle>
          <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors duration-300">
            <MapPin className="h-4 w-4 text-green-500" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex items-baseline space-x-2">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
              {onSite}
            </div>
            <div className="text-xs text-green-500 font-medium">
              {onSitePercentage.toFixed(0)}%
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Physical presence
          </p>
          <div className="mt-3 w-full bg-muted/50 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${onSitePercentage}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Remote Card */}
      <Card className="card-modern glass-hover group overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
          <CardTitle className="text-sm font-semibold text-foreground/80">Remote</CardTitle>
          <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors duration-300">
            <Wifi className="h-4 w-4 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex items-baseline space-x-2">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
              {offSite}
            </div>
            <div className="text-xs text-blue-500 font-medium">
              {offSitePercentage.toFixed(0)}%
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Virtual work
          </p>
          <div className="mt-3 w-full bg-muted/50 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${offSitePercentage}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
