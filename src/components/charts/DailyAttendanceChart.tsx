import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { getPeriodMonthName } from "@/lib/utils";
import { CHART_COLORS, ATTENDANCE_THRESHOLDS } from "@/lib/constants";
import { SourceType } from "@/types/attendance";

interface DailyAttendanceChartProps {
  chartData: Array<{
    date: string;
    attendance: number;
    onSite: number;
    offSite: number;
  }>;
  currentPeriod: any;
  selectedSource: SourceType;
  availableSources: string[];
}

export function DailyAttendanceChart({
  chartData,
  currentPeriod,
  selectedSource,
  availableSources,
}: DailyAttendanceChartProps) {
  const barChartConfig = {
    attendance: {
      label: "Attendance",
      color:
        selectedSource === "all"
          ? CHART_COLORS.BAR_COLORS.DEFAULT
          : CHART_COLORS.PIE_COLORS[
              availableSources.indexOf(selectedSource) % CHART_COLORS.PIE_COLORS.length
            ],
    },
  } satisfies ChartConfig;

  const getBarColor = (value: number) => {
    if (value < ATTENDANCE_THRESHOLDS.LOW) return CHART_COLORS.BAR_COLORS.LOW;
    if (value < ATTENDANCE_THRESHOLDS.MEDIUM_LOW) return CHART_COLORS.BAR_COLORS.MEDIUM_LOW;
    if (value < ATTENDANCE_THRESHOLDS.MEDIUM) return CHART_COLORS.BAR_COLORS.MEDIUM;
    return CHART_COLORS.BAR_COLORS.HIGH;
  };

  return (
    <Card className="card-modern glass-hover group overflow-hidden animate-slide-in-right">
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
            {/* Glassmorphic SVG gradients: blend orange, green, blue for all bars */}
            <defs>
              <linearGradient id="bar-glass-blend" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#fb923c" stop-opacity="0.7" />
                <stop offset="40%" stop-color="#22c55e" stop-opacity="0.7" />
                <stop offset="80%" stop-color="#2563eb" stop-opacity="0.7" />
                <stop offset="100%" stop-color="#fff" stop-opacity="0.15" />
              </linearGradient>
              {/* Pie gradients for legend/other use (unchanged for now) */}
              <linearGradient id="pie-glass-blue" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#f0f9ff" stop-opacity="0.8" />
                <stop offset="100%" stop-color="#0ea5e9" stop-opacity="0.4" />
              </linearGradient>
              <linearGradient id="pie-glass-teal" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#f0fdfa" stop-opacity="0.8" />
                <stop offset="100%" stop-color="#14b8a6" stop-opacity="0.4" />
              </linearGradient>
              <linearGradient id="pie-glass-slate" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#f8fafc" stop-opacity="0.8" />
                <stop offset="100%" stop-color="#64748b" stop-opacity="0.4" />
              </linearGradient>
              <linearGradient id="pie-glass-indigo" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#eef2ff" stop-opacity="0.8" />
                <stop offset="100%" stop-color="#6366f1" stop-opacity="0.4" />
              </linearGradient>
              <linearGradient id="pie-glass-cyan" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#ecfeff" stop-opacity="0.8" />
                <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.4" />
              </linearGradient>
              <linearGradient id="pie-glass-gray" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#f9fafb" stop-opacity="0.8" />
                <stop offset="100%" stop-color="#6b7280" stop-opacity="0.4" />
              </linearGradient>
            </defs>
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
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill="url(#bar-glass-blend)"
                  className="transition-all duration-300"
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
