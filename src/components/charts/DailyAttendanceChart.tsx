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
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { CHART_COLORS } from "@/lib/constants";
import { getPeriodMonthName } from "@/lib/utils";
import { AttendancePeriod } from "@/types/attendance";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    XAxis,
    YAxis,
} from "recharts";

interface DailyAttendanceChartProps {
  chartData: Array<{
    date: string;
    attendance: number;
    onSite: number;
    offSite: number;
  }>;
  currentPeriod: AttendancePeriod;
}

export function DailyAttendanceChart({
  chartData,
  currentPeriod,
}: DailyAttendanceChartProps) {
  const barChartConfig = {
    attendance: {
      label: "Attendance",
      color: CHART_COLORS.BAR_COLORS.DEFAULT,
    },
  } satisfies ChartConfig;

  return (
    <Card className="card-modern glass-hover group overflow-hidden animate-slide-in-right">
      <CardHeader className="pb-4 relative z-10">
        <CardTitle>
          Daily Attendance in{" "}
          {currentPeriod
            ? getPeriodMonthName(
                currentPeriod.from_date,
                currentPeriod.to_date
              )
            : "selected month"}
        </CardTitle>
        <CardDescription className="text-muted-foreground/80">
          Attendance per day in {getPeriodMonthName(currentPeriod.from_date, currentPeriod.to_date)}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 relative z-10">
        <ChartContainer
          config={barChartConfig}
          className="h-[320px] !aspect-auto"
        >
          <BarChart accessibilityLayer data={chartData}>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ff8000" stopOpacity="1" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="1" />
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
                    const totalSeconds = numValue * 3600;
                    const hours = Math.floor(totalSeconds / 3600);
                    const minutes = Math.floor((totalSeconds % 3600) / 60);
                    const seconds = Math.floor(totalSeconds % 60);

                    if (hours > 0) {
                      if (seconds > 0) {
                        return `${hours}h ${minutes}m ${seconds}s`;
                      }
                      return `${hours}h ${minutes}m`;
                    }
                    if (minutes > 0) {
                      if (seconds > 0) {
                        return `${minutes}m ${seconds}s`;
                      }
                      return `${minutes}m`;
                    }
                    return `${seconds}s`;
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
                  fill="url(#gradient)"
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
