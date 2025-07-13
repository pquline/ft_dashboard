import React from "react";
import {
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { getPeriodMonthName } from "@/lib/utils";
import { CHART_COLORS } from "@/lib/constants";
import { SourceType } from "@/types/attendance";

interface SourcesDistributionChartProps {
  sourceData: Array<{
    name: string;
    value: number;
    type: "none";
  }>;
  currentPeriod: any;
  selectedSource: SourceType;
}

export function SourcesDistributionChart({
  sourceData,
  currentPeriod,
  selectedSource,
}: SourcesDistributionChartProps) {
  const pieChartConfig = {
    ...sourceData.reduce(
      (config, item, index) => ({
        ...config,
        [item.name]: {
          label: item.name,
          color: CHART_COLORS.PIE_COLORS[index % CHART_COLORS.PIE_COLORS.length],
        },
      }),
      {}
    ),
  } satisfies ChartConfig;

  return (
    <Card className="card-modern glass-hover group overflow-hidden animate-slide-in-right">
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
              {/* Glassmorphic SVG gradients */}
              <defs>
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
                    fill={CHART_COLORS.PIE_COLORS[index % CHART_COLORS.PIE_COLORS.length]}
                    className="transition-all duration-300"
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
  );
}
