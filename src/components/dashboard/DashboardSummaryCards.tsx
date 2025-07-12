import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin, Wifi, TrendingUp } from 'lucide-react';

interface DashboardSummaryCardsProps {
  total: string;
  onSite: string;
  offSite: string;
}

export function DashboardSummaryCards({ total, onSite, offSite }: DashboardSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {/* Total Hours Card */}
      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 py-4 relative z-10">
          <CardTitle className="text-sm font-medium text-blue-100">Total Hours</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Clock className="h-5 w-5 text-white" />
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-4 relative z-10">
          <div className="text-3xl font-bold mb-1">{total}</div>
          <div className="flex items-center text-blue-100 text-sm">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>This month</span>
          </div>
        </CardContent>
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
      </Card>

      {/* On Campus Card */}
      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-transparent"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 py-4 relative z-10">
          <CardTitle className="text-sm font-medium text-emerald-100">On Campus</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <MapPin className="h-5 w-5 text-white" />
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-4 relative z-10">
          <div className="text-3xl font-bold mb-1">{onSite}</div>
          <div className="flex items-center text-emerald-100 text-sm">
            <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
            <span>Physical presence</span>
          </div>
        </CardContent>
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
      </Card>

      {/* Remote Card */}
      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 py-4 relative z-10">
          <CardTitle className="text-sm font-medium text-purple-100">Remote</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Wifi className="h-5 w-5 text-white" />
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-4 relative z-10">
          <div className="text-3xl font-bold mb-1">{offSite}</div>
          <div className="flex items-center text-purple-100 text-sm">
            <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
            <span>Virtual work</span>
          </div>
        </CardContent>
        <div className="absolute bottom-0 right-0 w-14 h-14 bg-white/10 rounded-full -translate-y-6 translate-x-6"></div>
      </Card>
    </div>
  );
}
