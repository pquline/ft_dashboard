'use client'

import { useState, useEffect } from 'react';
import { AttendanceData, type SourceType } from '@/types/attendance';
import { parseISODuration, formatDuration, calculateTotalAttendance, calculateOnSiteAttendance, calculateOffSiteAttendance, getMonthName, getPeriodMonthName, getUniqueSources } from '@/lib/utils';
import { calculateTotalAttendanceForSource, calculateOnSiteAttendanceForSource, calculateOffSiteAttendanceForSource, getDailyAttendanceForSource } from '@/lib/utils';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { DashboardSummaryCards } from '@/components/dashboard/DashboardSummaryCards';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

  // Prepare summary card values
  const total = currentPeriod ? formatDuration(calculateTotalAttendanceForSource(currentPeriod, selectedSource)) : '0h 0m';
  const onSite = currentPeriod ? formatDuration(calculateOnSiteAttendanceForSource(currentPeriod, selectedSource)) : '0h 0m';
  const offSite = currentPeriod ? formatDuration(calculateOffSiteAttendanceForSource(currentPeriod, selectedSource)) : '0h 0m';

  // Prepare daily data for chart and table
  const filteredDailyData = currentPeriod ? getDailyAttendanceForSource(currentPeriod, selectedSource) : [];

  const chartData = filteredDailyData.map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    attendance: day.total / 3600,
    onSite: day.onSite / 3600,
    offSite: day.offSite / 3600,
  }));

  const sourceData = currentPeriod?.detailed_attendance
    .filter(detail => {
      if (detail.name === 'locations') return false; // Exclude locations
      if (selectedSource === 'all') return true;
      return detail.name === selectedSource;
    })
    .map(detail => ({
      name: detail.name,
      value: parseISODuration(detail.duration) / 3600,
      type: detail.type,
    })) || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <DashboardHeader login={data.login} imageUrl={data.image_url} />

      {/* Filters */}
      <DashboardFilters
        months={months}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        sources={availableSources}
        selectedSource={selectedSource}
        onSourceChange={(value) => setSelectedSource(value as SourceType)}
      />

      {/* Summary Cards */}
      <DashboardSummaryCards total={total} onSite={onSite} offSite={offSite} />

      {/* Charts and Tables (tabs) - unchanged for now */}
      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily">Daily Overview</TabsTrigger>
          <TabsTrigger value="sources">Sources Breakdown</TabsTrigger>
          <TabsTrigger value="table">Detailed Table</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Attendance</CardTitle>
                            <CardDescription>
                {selectedSource === 'all'
                  ? 'Hours spent on campus per day (All sources)'
                  : `Hours spent on campus per day (${selectedSource.charAt(0).toUpperCase() + selectedSource.slice(1)} source)`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} hours`, 'Attendance']} />
                  <Bar dataKey="attendance" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Sources Distribution</CardTitle>
                <CardDescription>
                  {selectedSource === 'all'
                    ? 'Time spent by source type (All sources)'
                    : `Time spent by ${selectedSource} source`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sourceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={sourceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {sourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} hours`, 'Duration']} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No data available for the selected source in this month
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sources Details</CardTitle>
                <CardDescription>
                  {selectedSource === 'all'
                    ? 'All sources'
                    : `${selectedSource.charAt(0).toUpperCase() + selectedSource.slice(1)} source only`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
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
        </TabsContent>

        <TabsContent value="table" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Attendance Details</CardTitle>
              <CardDescription>Showing all sources attendance per day</CardDescription>
            </CardHeader>
            <CardContent>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
