import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin, Wifi } from 'lucide-react';

interface DashboardSummaryCardsProps {
  total: string;
  onSite: string;
  offSite: string;
}

export function DashboardSummaryCards({ total, onSite, offSite }: DashboardSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 py-3">
          <CardTitle className="text-sm font-medium">Total</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-4 pb-3">
          <div className="text-xl font-semibold">{total}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 py-3">
          <CardTitle className="text-sm font-medium">On Campus</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-4 pb-3">
          <div className="text-xl font-semibold">{onSite}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 py-3">
          <CardTitle className="text-sm font-medium">Remote</CardTitle>
          <Wifi className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-4 pb-3">
          <div className="text-xl font-semibold">{offSite}</div>
        </CardContent>
      </Card>
    </div>
  );
}
