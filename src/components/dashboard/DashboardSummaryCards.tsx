import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DashboardSummaryCardsProps {
  total: string;
  onSite: string;
  offSite: string;
}

export function DashboardSummaryCards({ total, onSite, offSite }: DashboardSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">On-Site</CardTitle>
          <Badge variant="outline">42 Paris</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{onSite}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Off-Site</CardTitle>
          <Badge variant="outline">Discord</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{offSite}</div>
        </CardContent>
      </Card>
    </div>
  );
}
