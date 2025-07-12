'use client'

import { useState, useEffect } from 'react';
import { AttendanceData, type SourceType } from '@/types/attendance';
import { parseISODuration, formatDuration, getPeriodMonthName, getUniqueSources, filterDailyAttendancesToMainMonth } from '@/lib/utils';
import { calculateTotalAttendanceForSource, calculateOnSiteAttendanceForSource, calculateOffSiteAttendanceForSource, getDailyAttendanceForSource } from '@/lib/utils';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { DashboardSummaryCards } from '@/components/dashboard/DashboardSummaryCards';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, PieChart, Pie, Cell } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export default function Dashboard() {
  const [data, setData] = useState<AttendanceData | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedSource, setSelectedSource] = useState<SourceType>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/reponse.json')
      .then(res => res.json())
      .then((data: AttendanceData) => {
        setData(data);
        if (data.attendance.length > 0) {
          setSelectedMonth(data.attendance[0].from_date);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading data:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (data && selectedMonth && selectedSource !== 'all') {
      const uniqueSources = getUniqueSources(data.attendance);
      const availableSources = uniqueSources.filter(source => source !== 'locations');
      if (!availableSources.includes(selectedSource)) {
        setSelectedSource('all');
      }
    }
  }, [data, selectedMonth, selectedSource]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading attendance data...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Failed to load attendance data</div>
      </div>
    );
  }

  const currentPeriod = data.attendance.find(period => period.from_date === selectedMonth);
  const uniqueSources = getUniqueSources(data.attendance)
  const availableSources = uniqueSources.filter(source => source !== 'locations');;

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

  const sourceData = currentPeriod?.detailed_attendance
    .filter(detail => {
      if (detail.name === 'locations') return false;
      if (selectedSource === 'all') return true;
      return detail.name === selectedSource;
    })
    .map(detail => ({
      name: detail.name,
      value: parseISODuration(detail.duration) / 3600,
      type: detail.type,
    })) || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Chart configurations
  const barChartConfig = {
    attendance: {
      label: "Attendance",
      color: selectedSource === 'all'
        ? "#8884d8"
        : COLORS[availableSources.indexOf(selectedSource) % COLORS.length],
    },
  } satisfies ChartConfig;

  const pieChartConfig = {
    ...sourceData.reduce((config, item, index) => ({
      ...config,
      [item.name]: {
        label: item.name.charAt(0).toUpperCase() + item.name.slice(1),
        color: COLORS[index % COLORS.length],
      },
    }), {}),
  } satisfies ChartConfig;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <TooltipProvider>
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <DashboardHeader login={data.login} imageUrl={data.image_url} />

          <div className="flex flex-col lg:flex-row gap-6 mt-6">
            {/* Sidebar Filters */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="sticky top-6">
                <DashboardFilters
                  months={months}
                  selectedMonth={selectedMonth}
                  onMonthChange={setSelectedMonth}
                  sources={availableSources}
                  selectedSource={selectedSource}
                  onSourceChange={(value) => setSelectedSource(value as SourceType)}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-4">
              {/* Summary Cards */}
              <DashboardSummaryCards total={total} onSite={onSite} offSite={offSite} />

              {/* Daily Attendance Chart */}
              <div className="space-y-4">
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
                            formatter={(value: any) => {
                              const numValue = typeof value === 'number' ? value : parseFloat(value);
                              const hours = Math.floor(numValue);
                              const minutes = Math.round((numValue - hours) * 60);
                              return `${hours}h ${minutes}m`;
                            }}
                          />}
                        />
                        <Bar dataKey="attendance" fill="var(--color-attendance)" radius={4} />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Sources Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                        <ChartContainer config={pieChartConfig} className="h-[280px] !aspect-auto">
                          <PieChart accessibilityLayer data={sourceData}>
                            <Pie
                              data={sourceData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }: { name: string; percent?: number }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="var(--color-sipass)"
                              dataKey="value"
                            >
                              {sourceData.map((entry) => (
                                <Cell key={`cell-${entry.name}`} fill={`var(--color-${entry.name})`} />
                              ))}
                            </Pie>
                            <ChartTooltip
                              content={<ChartTooltipContent
                                formatter={(value: any) => {
                                  const numValue = typeof value === 'number' ? value : parseFloat(value);
                                  const hours = Math.floor(numValue);
                                  const minutes = Math.round((numValue - hours) * 60);
                                  return `${hours}h ${minutes}m`;
                                }}
                              />}
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

                {/* Daily Attendance Table */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Daily Attendance Details</CardTitle>
                    <CardDescription>Showing all sources attendance per day</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Day</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>On-Site</TableHead>
                          <TableHead>Off-Site</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDailyData.map((day, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{day.date}</TableCell>
                            <TableCell>{day.day}</TableCell>
                            <TableCell>{formatDuration(day.total)}</TableCell>
                            <TableCell>{formatDuration(day.onSite)}</TableCell>
                            <TableCell>{formatDuration(day.offSite)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}
