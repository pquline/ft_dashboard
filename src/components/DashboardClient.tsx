"use client";
import React, { useState, useEffect } from "react";
import { AttendanceData, SourceType } from "@/types/attendance";
import {
  parseISODuration,
  formatDuration,
  getPeriodMonthName,
  filterDailyAttendancesToMainMonth,
  devLog,
  getMainMonth,
} from "@/lib/utils";
import {
  calculateTotalAttendanceForSource,
  calculateOnSiteAttendanceForSource,
  calculateOffSiteAttendanceForSource,
  getDailyAttendanceForSource,
} from "@/lib/utils";
import { Header } from "@/components/Header";
import { DashboardSummaryCards } from "@/components/DashboardSummaryCards";
import { Footer } from "@/components/Footer";
import { AttendanceCalendar } from "@/components/AttendanceCalendar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

export function DashboardClient({
  data,
  defaultMonth,
  availableSources,
}: {
  data: AttendanceData;
  defaultMonth: string;
  availableSources: string[];
}) {
  const [selectedMonth, setSelectedMonth] = useState<string>(defaultMonth);
  const [selectedSource, setSelectedSource] = useState<SourceType>("all");

  devLog.debug("=== MONTH SELECTION DEBUG ===");
  devLog.debug("defaultMonth:", defaultMonth);
  devLog.debug("selectedMonth state:", selectedMonth);
  devLog.debug(
    "Available months:",
    data.attendance.map((p) => ({
      from_date: p.from_date,
      to_date: p.to_date,
      label: getPeriodMonthName(p.from_date, p.to_date),
    }))
  );

  const handleMonthChange = (newMonth: string) => {
    console.log("=== MONTH CHANGE TRIGGERED ===");
    console.log("Month change:", {
      from: selectedMonth,
      to: newMonth,
    });
    setSelectedMonth(newMonth);
  };

  useEffect(() => {
    if (data && selectedMonth && selectedSource !== "all") {
      const available = availableSources.filter(
        (source) => source !== "locations"
      );
      if (!available.includes(selectedSource)) {
        setSelectedSource("all");
      }
    }
  }, [data, selectedMonth, selectedSource, availableSources]);

  const currentPeriod = data.attendance.find(
    (period) => period.from_date === selectedMonth
  );

  devLog.debug(
    "Available months:",
    data.attendance.map((p) => ({
      from_date: p.from_date,
      to_date: p.to_date,
      label: getPeriodMonthName(p.from_date, p.to_date),
    }))
  );
  devLog.debug("Selected month:", selectedMonth);
  devLog.debug("Current period found:", !!currentPeriod);

  if (currentPeriod) {
    const d = new Date(currentPeriod.from_date);
    const calendarMonth = new Date(d.getFullYear(), d.getMonth(), 1);
    const headerLabel = getPeriodMonthName(
      currentPeriod.from_date,
      currentPeriod.to_date
    );
    devLog.debug("currentPeriod.from_date:", currentPeriod.from_date);
    devLog.debug("currentPeriod.to_date:", currentPeriod.to_date);
    devLog.debug(
      "calendarMonth (passed to calendar):",
      calendarMonth.toString()
    );
    devLog.debug("headerLabel:", headerLabel);
  }

  const months = data.attendance.map((period) => ({
    value: period.from_date,
    label: getPeriodMonthName(period.from_date, period.to_date),
  }));

  const total = currentPeriod
    ? formatDuration(
        calculateTotalAttendanceForSource(currentPeriod, selectedSource)
      )
    : "0h 0m";
  const onSite = currentPeriod
    ? formatDuration(
        calculateOnSiteAttendanceForSource(currentPeriod, selectedSource)
      )
    : "0h 0m";
  const offSite = currentPeriod
    ? formatDuration(
        calculateOffSiteAttendanceForSource(currentPeriod, selectedSource)
      )
    : "0h 0m";

  let filteredDailyData = currentPeriod
    ? getDailyAttendanceForSource(currentPeriod, selectedSource)
    : [];
  if (currentPeriod) {
    filteredDailyData = filterDailyAttendancesToMainMonth(
      currentPeriod,
      filteredDailyData
    );
  }

  const chartData = filteredDailyData.map((day) => ({
    date: new Date(day.date).toLocaleDateString("en-US", { day: "numeric" }),
    attendance: day.total / 3600,
    onSite: day.onSite / 3600,
    offSite: day.offSite / 3600,
  }));

  devLog.debug("Chart data length:", chartData.length);
  devLog.debug(
    "Chart data dates:",
    chartData.map((d) => d.date)
  );
  devLog.debug(
    "Chart data with attendance > 0:",
    chartData.filter((d) => d.attendance > 0)
  );

  const sourceData =
    currentPeriod?.detailed_attendance
      .filter((detail) => {
        if (detail.name === "locations") return false;
        if (selectedSource === "all") return true;
        return detail.name === selectedSource;
      })
      .map((detail) => ({
        name: detail.name,
        value: parseISODuration(detail.duration) / 3600,
        type: "none" as const,
      })) || [];

  const PIE_COLORS = [
    "#ea580c", // Orange-600
    "#fb923c", // Orange-400
    "#f97316", // Orange-500
    "#c2410c", // Orange-600
    "#f59e0b", // Amber-500
    "#d97706", // Amber-600
  ];

  const barChartConfig = {
    attendance: {
      label: "Attendance",
      color:
        selectedSource === "all"
          ? "#8884d8"
          : PIE_COLORS[
              availableSources.indexOf(selectedSource) % PIE_COLORS.length
            ],
    },
  } satisfies ChartConfig;

  const pieChartConfig = {
    ...sourceData.reduce(
      (config, item, index) => ({
        ...config,
        [item.name]: {
          label: item.name,
          color: PIE_COLORS[index % PIE_COLORS.length],
        },
      }),
      {}
    ),
  } satisfies ChartConfig;

  return (
    <div className="min-h-screen gradient-bg">
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
        <div className="space-y-8 mt-8">
          <DashboardSummaryCards
            total={total}
            onSite={onSite}
            offSite={offSite}
            currentPeriod={currentPeriod}
          />

          {/* Daily Attendance Chart */}
          <div className="space-y-8">
            <Card className="card-modern group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="pb-4 relative z-10">
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Daily Attendance in{" "}
                  {currentPeriod
                    ? getPeriodMonthName(
                        currentPeriod.from_date,
                        currentPeriod.to_date
                      )
                    : "selected month"}
                </CardTitle>
                <CardDescription className="text-muted-foreground/80">
                  {selectedSource === "all"
                    ? "Hours spent on campus per day (All sources)"
                    : `Hours spent on campus per day (${selectedSource} source)`}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 relative z-10">
                <ChartContainer
                  config={barChartConfig}
                  className="h-[320px] !aspect-auto"
                >
                  <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid
                      vertical={false}
                      strokeDasharray="3 3"
                      stroke="currentColor"
                      opacity={0.1}
                    />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      tickMargin={12}
                      axisLine={false}
                      tick={{
                        fontSize: 12,
                        fill: "currentColor",
                        opacity: 0.7,
                      }}
                    />
                    <YAxis
                      tickLine={false}
                      tickMargin={12}
                      axisLine={false}
                      tickFormatter={(value: number) => `${value}h`}
                      tick={{
                        fontSize: 12,
                        fill: "currentColor",
                        opacity: 0.7,
                      }}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          formatter={(value: unknown) => {
                            const numValue =
                              typeof value === "number"
                                ? value
                                : parseFloat(String(value));
                            const hours = Math.floor(numValue);
                            const minutes = Math.round(
                              (numValue - hours) * 60
                            );
                            return `${hours}h ${minutes}m`;
                          }}
                        />
                      }
                    />
                    <Bar
                      dataKey="attendance"
                      radius={[4, 4, 0, 0]}
                      className="transition-all duration-300"
                    >
                      {chartData.map((entry, index) => {
                        const value = entry.attendance;
                        let color;
                        if (value < 4)
                          color = "#fdba74"; // Orange-300 for low attendance
                        else if (value < 8)
                          color = "#fb923c"; // Orange-400 for medium-low
                        else if (value < 12)
                          color = "#f97316"; // Orange-500 for medium
                        else color = "#ea580c"; // Orange-600 for high attendance

                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={color}
                            className="transition-all duration-300 hover:opacity-80"
                          />
                        );
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
                      const newMonthStr = data.attendance.find((period) => {
                        const { year, month } = getMainMonth(period);
                        return (
                          year === date.getFullYear() && month === date.getMonth()
                        );
                      })?.from_date;
                      if (newMonthStr) setSelectedMonth(newMonthStr);
                    }}
                  />
            )}

            {/* Sources Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="card-modern group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="pb-4 relative z-10">
                  <CardTitle className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    Sources Distribution in{" "}
                    {currentPeriod
                      ? getPeriodMonthName(
                          currentPeriod.from_date,
                          currentPeriod.to_date
                        )
                      : "selected month"}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground/80">
                    {selectedSource === "all"
                      ? "Time spent by source type (All sources)"
                      : `Time spent by ${selectedSource} source`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 relative z-10">
                  {sourceData.length > 0 ? (
                    <ChartContainer
                      config={pieChartConfig}
                      className="mx-auto aspect-square max-h-[320px]"
                    >
                      <PieChart>
                        <Pie
                          data={sourceData}
                          dataKey="value"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={2}
                        >
                          {sourceData.map((entry, index) => (
                            <Cell
                              key={`cell-${entry.name}`}
                              fill={PIE_COLORS[index % PIE_COLORS.length]}
                              className="transition-all duration-300 hover:opacity-80"
                            />
                          ))}
                        </Pie>
                        <ChartLegend
                          content={
                            <ChartLegendContent
                              nameKey="name"
                              payload={sourceData}
                            />
                          }
                          className="-translate-y-2 flex-wrap gap-3 *:basis-1/3 *:justify-center"
                        />
                      </PieChart>
                    </ChartContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[320px] text-muted-foreground">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                          <span className="text-2xl">📊</span>
                        </div>
                        <p>
                          No data available for the selected source in
                          selected month
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="card-modern group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="pb-4 relative z-10">
                  <CardTitle className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    Sources Details in{" "}
                    {currentPeriod
                      ? getPeriodMonthName(
                          currentPeriod.from_date,
                          currentPeriod.to_date
                        )
                      : "selected month"}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground/80">
                    {selectedSource === "all"
                      ? "All sources"
                      : `${selectedSource} source only`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 relative z-10">
                  {sourceData.length > 0 ? (
                    <div className="overflow-hidden rounded-lg border border-border/30">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/30">
                            <TableHead className="font-semibold">
                              Source
                            </TableHead>
                            <TableHead className="font-semibold">
                              Type
                            </TableHead>
                            <TableHead className="font-semibold">
                              Duration
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentPeriod?.detailed_attendance
                            .filter((detail) => {
                              if (detail.name === "locations") return false;
                              if (selectedSource === "all") return true;
                              return detail.name === selectedSource;
                            })
                            .map((detail, index) => (
                              <TableRow
                                key={index}
                                className="hover:bg-muted/20 transition-colors duration-200"
                              >
                                <TableCell className="font-medium">
                                  {detail.name}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      detail.type === "on_site"
                                        ? "secondary"
                                        : "outline"
                                    }
                                    className={`${
                                      detail.type === "on_site"
                                        ? "bg-green-500/10 text-green-600 border-green-500/20"
                                        : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                    }`}
                                  >
                                    {detail.type === "on_site"
                                      ? "On Campus"
                                      : "Remote"}
                                  </Badge>
                                </TableCell>
                                <TableCell className="font-mono">
                                  {formatDuration(
                                    parseISODuration(detail.duration)
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[320px] text-muted-foreground">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                          <span className="text-2xl">📋</span>
                        </div>
                        <p>
                          No data available for the selected source in
                          selected month
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
}
