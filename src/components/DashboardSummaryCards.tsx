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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
          <p className="text-xs text-muted-foreground">
            Total hours for {currentPeriod ? getPeriodMonthName(currentPeriod.from_date, currentPeriod.to_date) : 'Loading...'}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">On Campus</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{onSite}</div>
          <p className="text-xs text-muted-foreground">
            Physical presence
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Remote</CardTitle>
          <Wifi className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{offSite}</div>
          <p className="text-xs text-muted-foreground">
            Virtual work
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
