import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin, Wifi, Target } from 'lucide-react';
import { getPeriodMonthName } from '@/lib/utils';
import { AttendancePeriod } from '@/types/attendance';

interface DashboardSummaryCardsProps {
  total: string;
  onSite: string;
  offSite: string;
  currentPeriod?: AttendancePeriod;
}

export function DashboardSummaryCards({ total, onSite, offSite, currentPeriod }: DashboardSummaryCardsProps) {
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

  const totalHours = totalMinutes / 60;
  const onSitePercentage = totalMinutes > 0 ? (onSiteMinutes / totalMinutes) * 100 : 0;
  const offSitePercentage = totalMinutes > 0 ? (offSiteMinutes / totalMinutes) * 100 : 0;

  // Calculate remaining hours (140 hours target - total hours)
  const remainingHours = Math.max(0, 140 - totalHours);
  const remainingPercentage = (remainingHours / 140) * 100;

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

      {/* Remaining Hours Card */}
      <Card className="card-modern glass-hover group overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
          <CardTitle className="text-sm font-semibold text-foreground/80">Remaining Hours</CardTitle>
          <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors duration-300">
            <Target className="h-4 w-4 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-center mb-4">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
              {Math.floor(remainingHours)}h {Math.round((remainingHours % 1) * 60)}m
            </div>
            <div className="text-xs text-blue-500 font-medium mt-1">
              {remainingPercentage.toFixed(0)}% remaining
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              To reach 140h target
            </p>
          </div>

          {/* Horizontal Bar Chart */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0h</span>
              <span>140h</span>
            </div>
            <div className="relative h-6 bg-muted/30 rounded-lg overflow-hidden">
              {/* Completed hours bar */}
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                style={{ width: `${(totalHours / 140) * 100}%` }}
              />
              {/* Remaining hours indicator */}
              <div
                className="absolute top-0 h-full w-1 bg-blue-500 transition-all duration-500"
                style={{ left: `${(totalHours / 140) * 100}%` }}
              />
              {/* Current position marker */}
              <div
                className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm transition-all duration-500"
                style={{ left: `calc(${(totalHours / 140) * 100}% - 6px)` }}
              />
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-green-600 font-medium">Completed: {totalHours.toFixed(1)}h</span>
              <span className="text-blue-600 font-medium">Remaining: {remainingHours.toFixed(1)}h</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Work Distribution Card */}
      <Card className="card-modern glass-hover group overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
          <CardTitle className="text-sm font-semibold text-foreground/80">Work Distribution</CardTitle>
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
            On campus • {offSite} remote ({offSitePercentage.toFixed(0)}%)
          </p>
          <div className="mt-3 w-full bg-muted/50 rounded-full h-2 overflow-hidden">
            <div className="flex h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-2 transition-all duration-500"
                style={{ width: `${onSitePercentage}%` }}
              ></div>
              <div
                className="bg-gradient-to-r from-red-500 to-red-600 h-2 transition-all duration-500"
                style={{ width: `${offSitePercentage}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
