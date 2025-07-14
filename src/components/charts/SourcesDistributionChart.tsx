import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import { CHART_COLORS } from "@/lib/constants";
import { getPeriodMonthName } from "@/lib/utils";
import { AttendancePeriod, SourceType } from "@/types/attendance";
import {
    Cell,
    Pie,
    PieChart,
} from "recharts";

interface SourcesDistributionChartProps {
  sourceData: Array<{
    name: string;
    value: number;
    type: "none";
  }>;
  currentPeriod: AttendancePeriod;
}

export function SourcesDistributionChart({
  sourceData,
  currentPeriod,
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
          Time spent by source type
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
                <linearGradient id="gradient-orange" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ff8000" stopOpacity="1" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00c6fb" stopOpacity="1" />
                  <stop offset="100%" stopColor="#005bea" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="gradient-purple" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="1" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="gradient-green" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00ff99" stopOpacity="1" />
                  <stop offset="100%" stopColor="#00e676" stopOpacity="0.95" />
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
