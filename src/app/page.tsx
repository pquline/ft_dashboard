'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { AttendanceData, type SourceType } from '@/types/attendance'
import { parseISODuration, formatDuration, formatHours, getMonthName, getUniqueSources } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function Dashboard() {
  const [data, setData] = useState<AttendanceData | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<string>('')
  const [selectedSource, setSelectedSource] = useState<SourceType>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load the sample data from reponse.json
    fetch('/reponse.json')
      .then(res => res.json())
      .then((data: AttendanceData) => {
        setData(data)
        if (data.attendance.length > 0) {
          setSelectedMonth(data.attendance[0].from_date)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading data:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading attendance data...</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Failed to load attendance data</div>
      </div>
    )
  }

  const currentPeriod = data.attendance.find(period => period.from_date === selectedMonth)
  const uniqueSources = getUniqueSources(data.attendance)

  const filteredDailyData = currentPeriod?.daily_attendances.filter(day => {
    if (selectedSource === 'all') return true
    return currentPeriod.detailed_attendance.some(detail => detail.name === selectedSource)
  }) || []

  const chartData = filteredDailyData.map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    attendance: parseISODuration(day.total_attendance) / 3600, // Convert to hours
    onSite: parseISODuration(day.total_on_site_attendance) / 3600,
    offSite: parseISODuration(day.total_off_site_attendance) / 3600,
  }))

  const sourceData = currentPeriod?.detailed_attendance.map(detail => ({
    name: detail.name,
    value: parseISODuration(detail.duration) / 3600,
    type: detail.type
  })) || []

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">42 Attendance Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {data.login}</p>
        </div>
        <div className="flex items-center space-x-2">
          <img
            src={data.image_url}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Month</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {data.attendance.map(period => (
                    <SelectItem key={period.from_date} value={period.from_date}>
                      {getMonthName(period.from_date)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium">Source</label>
              <Select value={selectedSource} onValueChange={(value: SourceType) => setSelectedSource(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {uniqueSources.map(source => (
                    <SelectItem key={source} value={source}>
                      {source.charAt(0).toUpperCase() + source.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentPeriod ? formatDuration(parseISODuration(currentPeriod.total_attendance)) : '0h 0m'}
            </div>
            <p className="text-xs text-muted-foreground">
              {currentPeriod ? formatHours(parseISODuration(currentPeriod.total_attendance)) : '0'} hours
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Site</CardTitle>
            <Badge variant="secondary">On Campus</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentPeriod ? formatDuration(parseISODuration(currentPeriod.total_on_site_attendance)) : '0h 0m'}
            </div>
            <p className="text-xs text-muted-foreground">
              {currentPeriod ? formatHours(parseISODuration(currentPeriod.total_on_site_attendance)) : '0'} hours
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Off-Site</CardTitle>
            <Badge variant="outline">Remote</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentPeriod ? formatDuration(parseISODuration(currentPeriod.total_off_site_attendance)) : '0h 0m'}
            </div>
            <p className="text-xs text-muted-foreground">
              {currentPeriod ? formatHours(parseISODuration(currentPeriod.total_off_site_attendance)) : '0'} hours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables */}
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
              <CardDescription>Hours spent on campus per day</CardDescription>
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
                <CardDescription>Time spent by source type</CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sources Details</CardTitle>
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
                    {currentPeriod?.detailed_attendance.map((detail, index) => (
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
                      <TableCell>{formatDuration(parseISODuration(day.total_attendance))}</TableCell>
                      <TableCell>{formatDuration(parseISODuration(day.total_on_site_attendance))}</TableCell>
                      <TableCell>{formatDuration(parseISODuration(day.total_off_site_attendance))}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
