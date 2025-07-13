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
            {/* Glassmorphic SVG gradients */}
            <defs>
              <linearGradient id="bar-glass-low" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#fff8f1" stop-opacity="0.7" />
                <stop offset="100%" stop-color="#fdba74" stop-opacity="0.4" />
              </linearGradient>
              <linearGradient id="bar-glass-medlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#fff8f1" stop-opacity="0.7" />
                <stop offset="100%" stop-color="#fb923c" stop-opacity="0.4" />
              </linearGradient>
              <linearGradient id="bar-glass-medium" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#e0f2fe" stop-opacity="0.7" />
                <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.4" />
              </linearGradient>
              <linearGradient id="bar-glass-high" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#dcfce7" stop-opacity="0.7" />
                <stop offset="100%" stop-color="#22d3ee" stop-opacity="0.4" />
              </linearGradient>
              <linearGradient id="bar-glass-default" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#f3f4f6" stop-opacity="0.7" />
                <stop offset="100%" stop-color="#a5b4fc" stop-opacity="0.4" />
              </linearGradient>
              {/* Pie gradients for legend/other use */}
              <linearGradient id="pie-glass-orange" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#fff8f1" stop-opacity="0.7" />
                <stop offset="100%" stop-color="#fb923c" stop-opacity="0.5" />
              </linearGradient>
              <linearGradient id="pie-glass-amber" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#fefce8" stop-opacity="0.7" />
                <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.5" />
              </linearGradient>
              <linearGradient id="pie-glass-blue" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#e0f2fe" stop-opacity="0.7" />
                <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.5" />
              </linearGradient>
              <linearGradient id="pie-glass-green" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#dcfce7" stop-opacity="0.7" />
                <stop offset="100%" stop-color="#22d3ee" stop-opacity="0.5" />
              </linearGradient>
              <linearGradient id="pie-glass-purple" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#ede9fe" stop-opacity="0.7" />
                <stop offset="100%" stop-color="#a5b4fc" stop-opacity="0.5" />
              </linearGradient>
              <linearGradient id="pie-glass-pink" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#fdf2f8" stop-opacity="0.7" />
                <stop offset="100%" stop-color="#f472b6" stop-opacity="0.5" />
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
                  fill={getBarColor(entry.attendance)}
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
