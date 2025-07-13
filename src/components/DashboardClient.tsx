'use client';
import React, { useState, useEffect } from 'react';
import { AttendanceData, SourceType } from '@/types/attendance';
import { parseISODuration, formatDuration, getPeriodMonthName, filterDailyAttendancesToMainMonth, devLog, getMainMonth } from '@/lib/utils';
import { calculateTotalAttendanceForSource, calculateOnSiteAttendanceForSource, calculateOffSiteAttendanceForSource, getDailyAttendanceForSource } from '@/lib/utils';
import { Header } from '@/components/Header';
import { DashboardSummaryCards } from '@/components/DashboardSummaryCards';
import { Footer } from '@/components/Footer';
import { AttendanceCalendar } from '@/components/AttendanceCalendar';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, PieChart, Pie, Cell } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';

export function DashboardClient({ data, defaultMonth, availableSources }: { data: AttendanceData, defaultMonth: string, availableSources: string[] }) {
  const [selectedMonth, setSelectedMonth] = useState<string>(defaultMonth);
  const [selectedSource, setSelectedSource] = useState<SourceType>('all');

  devLog.debug('=== MONTH SELECTION DEBUG ===');
  devLog.debug('defaultMonth:', defaultMonth);
  devLog.debug('selectedMonth state:', selectedMonth);
  devLog.debug('Available months:', data.attendance.map(p => ({
    from_date: p.from_date,
    to_date: p.to_date,
    label: getPeriodMonthName(p.from_date, p.to_date)
  })));

  const handleMonthChange = (newMonth: string) => {
    console.log('=== MONTH CHANGE TRIGGERED ===');
    console.log('Month change:', {
      from: selectedMonth,
      to: newMonth
    });
    setSelectedMonth(newMonth);
  };

  useEffect(() => {
    if (data && selectedMonth && selectedSource !== 'all') {
      const available = availableSources.filter(source => source !== 'locations');
      if (!available.includes(selectedSource)) {
        setSelectedSource('all');
      }
    }
  }, [data, selectedMonth, selectedSource, availableSources]);

  const currentPeriod = data.attendance.find(period => period.from_date === selectedMonth);

  // Debug currentPeriod changes on client side
  console.log('=== CURRENT PERIOD DEBUG ===');
  console.log('Selected month:', selectedMonth);
  console.log('Current period:', currentPeriod ? {
    from_date: currentPeriod.from_date,
    to_date: currentPeriod.to_date,
    label: getPeriodMonthName(currentPeriod.from_date, currentPeriod.to_date)
  } : 'NOT FOUND');

  devLog.debug('Available months:', data.attendance.map(p => ({
    from_date: p.from_date,
    to_date: p.to_date,
    label: getPeriodMonthName(p.from_date, p.to_date)
  })));
  devLog.debug('Selected month:', selectedMonth);
  devLog.debug('Current period found:', !!currentPeriod);

  if (currentPeriod) {
    const d = new Date(currentPeriod.from_date);
    const calendarMonth = new Date(d.getFullYear(), d.getMonth(), 1);
    const headerLabel = getPeriodMonthName(currentPeriod.from_date, currentPeriod.to_date);
    devLog.debug('currentPeriod.from_date:', currentPeriod.from_date);
    devLog.debug('currentPeriod.to_date:', currentPeriod.to_date);
    devLog.debug('calendarMonth (passed to calendar):', calendarMonth.toString());
    devLog.debug('headerLabel:', headerLabel);
  }

  const months = data.attendance.map(period => ({
    value: period.from_date,
    label: getPeriodMonthName(period.from_date, period.to_date),
  }));

  const total = currentPeriod ? formatDuration(calculateTotalAttendanceForSource(currentPeriod, selectedSource)) : '0h 0m';
  const onSite = currentPeriod ? formatDuration(calculateOnSiteAttendanceForSource(currentPeriod, selectedSource)) : '0h 0m';
  const offSite = currentPeriod ? formatDuration(calculateOffSiteAttendanceForSource(currentPeriod, selectedSource)) : '0h 0m';

  let filteredDailyData = currentPeriod ? getDailyAttendanceForSource(currentPeriod, selectedSource) : [];
  if (currentPeriod) {
    filteredDailyData = filterDailyAttendancesToMainMonth(currentPeriod, filteredDailyData);
  }



  const chartData = filteredDailyData.map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    attendance: day.total / 3600,
    onSite: day.onSite / 3600,
    offSite: day.offSite / 3600,
  }));



  devLog.debug('Chart data length:', chartData.length);
  devLog.debug('Chart data dates:', chartData.map(d => d.date));
  devLog.debug('Chart data with attendance > 0:', chartData.filter(d => d.attendance > 0));

  // Debug October 2024 specifically
  if (currentPeriod) {
    const octoberData = filteredDailyData.filter(day => {
      const date = new Date(day.date);
      return date.getFullYear() === 2024 && date.getMonth() === 9; // October 2024
    });
    console.log('October 2024 data:', octoberData);

    const oct22Data = filteredDailyData.find(day => {
      const date = new Date(day.date);
      return date.getFullYear() === 2024 && date.getMonth() === 9 && date.getDate() === 22;
    });
    console.log('October 22nd 2024 data:', oct22Data);

    if (oct22Data) {
      console.log('October 22nd 2024 hours:', oct22Data.total / 3600);
    }
  }

  const sourceData = currentPeriod?.detailed_attendance
    .filter(detail => {
      if (detail.name === 'locations') return false;
      if (selectedSource === 'all') return true;
      return detail.name === selectedSource;
    })
    .map(detail => ({
      name: detail.name,
      value: parseISODuration(detail.duration) / 3600,
      type: 'none' as const,
    })) || [];

  const PIE_COLORS = [
    '#ea580c', // Orange-600
    '#fb923c', // Orange-400
    '#f97316', // Orange-500
    '#c2410c', // Orange-600
  ];

  const barChartConfig = {
    attendance: {
      label: "Attendance",
      color: selectedSource === 'all'
        ? "#8884d8"
        : PIE_COLORS[availableSources.indexOf(selectedSource) % PIE_COLORS.length],
    },
  } satisfies ChartConfig;

  const pieChartConfig = {
    ...sourceData.reduce((config, item, index) => ({
      ...config,
      [item.name]: {
        label: item.name.charAt(0).toUpperCase() + item.name.slice(1),
        color: PIE_COLORS[index % PIE_COLORS.length],
      },
    }), {}),
} satisfies ChartConfig;

return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <TooltipProvider>
        {/* Header */}
        <Header
          login={data.login}
          imageUrl={data.image_url}
          months={months}
          selectedMonth={selectedMonth}
          onMonthChange={handleMonthChange}
          sources={availableSources}
          selectedSource={selectedSource}
          onSourceChange={(value) => setSelectedSource(value as SourceType)}
          />
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="space-y-6 mt-6">
            <DashboardSummaryCards total={total} onSite={onSite} offSite={offSite} />

            {/* Daily Attendance Chart */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Daily Attendance</CardTitle>
                  <CardDescription>
                    {selectedSource === 'all'
                      ? 'Hours spent on campus per day (All sources)'
                      : `Hours spent on campus per day (${selectedSource.charAt(0).toUpperCase() + selectedSource.slice(1)} source)`
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ChartContainer config={barChartConfig} className="h-[280px] !aspect-auto">
                    <BarChart accessibilityLayer data={chartData}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        />
                      <YAxis
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value: number) => `${value}h`}
                        />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent
                            formatter={(value: unknown) => {
                                const numValue = typeof value === 'number' ? value : parseFloat(String(value));
                                const hours = Math.floor(numValue);
                            const minutes = Math.round((numValue - hours) * 60);
                            return `${hours}h ${minutes}m`;
                        }}
                        />}
                        />
                      <Bar dataKey="attendance" radius={4}>
                        {chartData.map((entry, index) => {
                            const value = entry.attendance;
                            let color;
                            if (value < 4) color = '#fdba74'; // Orange-300 for low attendance
                            else if (value < 8) color = '#fb923c'; // Orange-400 for medium-low
                            else if (value < 12) color = '#f97316'; // Orange-500 for medium
                            else color = '#ea580c'; // Orange-600 for high attendance

                            return <Cell key={`cell-${index}`} fill={color} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

            {/* Daily Attendance Calendar */}
            {currentPeriod && (
                <AttendanceCalendar
                  period={currentPeriod}
                  selectedSource={selectedSource}
                  month={(() => {
                    const { year, month } = getMainMonth(currentPeriod);
                    return new Date(year, month, 1);
                  })()}
                  onMonthChange={(date) => {
                    const newMonthStr = data.attendance.find(period => {
                      const { year, month } = getMainMonth(period);
                      return year === date.getFullYear() && month === date.getMonth();
                    })?.from_date;
                    if (newMonthStr) setSelectedMonth(newMonthStr);
                  }}
                />
            )}

              {/* Sources Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Sources Distribution</CardTitle>
                    <CardDescription>
                      {selectedSource === 'all'
                        ? 'Time spent by source type (All sources)'
                        : `Time spent by ${selectedSource} source`
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {sourceData.length > 0 ? (
                      <ChartContainer config={pieChartConfig} className="mx-auto aspect-square max-h-[300px]">
                        <PieChart>
                          <Pie data={sourceData} dataKey="value">
                            {sourceData.map((entry, index) => (
                                <Cell key={`cell-${entry.name}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <ChartLegend
                            content={<ChartLegendContent nameKey="name" payload={sourceData} />}
                            className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                          />
                        </PieChart>
                      </ChartContainer>
                    ) : (
                      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                        No data available for the selected source in this month
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Sources Details</CardTitle>
                    <CardDescription>
                      {selectedSource === 'all'
                        ? 'All sources'
                        : `${selectedSource.charAt(0).toUpperCase() + selectedSource.slice(1)} source only`
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Source</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Duration</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentPeriod?.detailed_attendance
                          .filter(detail => {
                            if (detail.name === 'locations') return false;
                            if (selectedSource === 'all') return true;
                            return detail.name === selectedSource;
                          })
                          .map((detail, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{detail.name}</TableCell>
                              <TableCell>
                                <Badge variant={detail.type === 'on_site' ? 'secondary' : 'outline'}>
                                  {detail.type === 'on_site' ? 'On Campus' : 'Remote'}
                                </Badge>
                              </TableCell>
                              <TableCell>{formatDuration(parseISODuration(detail.duration))}</TableCell>
                            </TableRow>
                          ))}
                        {sourceData.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center text-muted-foreground">
                              No data available for the selected source in this month
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <Footer />
        </div>
      </TooltipProvider>
    </div>
  );
}
