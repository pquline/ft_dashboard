import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPeriodMonthName, parseISODuration, formatDuration } from "@/lib/utils";
import { AttendancePeriod } from "@/types/attendance";

interface SourcesHeatmapProps {
  currentPeriod: AttendancePeriod;
}

interface HeatmapCell {
  source: string;
  type: "on_site" | "off_site";
  duration: number;
  hours: number;
  date: string;
  dayOfWeek: string;
}

export function SourcesHeatmap({
  currentPeriod,
}: SourcesHeatmapProps) {
  const processHeatmapData = (): HeatmapCell[] => {
    if (!currentPeriod?.entries) return [];

    const cells: HeatmapCell[] = [];
    const sourceTotals: Record<string, number> = {};

    currentPeriod.entries.forEach((entry) => {
      const source = entry.source;
      const duration = new Date(entry.time_period.end_at).getTime() -
                      new Date(entry.time_period.begin_at).getTime();

      if (!sourceTotals[source]) {
        sourceTotals[source] = 0;
      }
      sourceTotals[source] += duration;
    });

    Object.entries(sourceTotals).forEach(([source, totalDuration]) => {
      const hours = totalDuration / (1000 * 60 * 60);
      const date = new Date().toISOString().split('T')[0]; // Use current date for demo
      const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'short' });

      cells.push({
        source,
        type: "on_site",
        duration: totalDuration,
        hours,
        date,
        dayOfWeek,
      });
    });

    return cells.sort((a, b) => b.hours - a.hours);
  };

  const heatmapData = processHeatmapData();
  const totalHours = heatmapData.reduce((sum, cell) => sum + cell.hours, 0);

  const getColorIntensity = (hours: number, maxHours: number) => {
    const intensity = Math.min(hours / maxHours, 1);
    return intensity;
  };

  const maxHours = Math.max(...heatmapData.map(cell => cell.hours), 1);

  const getSourceType = (sourceName: string): "on_site" | "off_site" => {
    const detail = currentPeriod?.detailed_attendance?.find(d => d.name === sourceName);
    return detail?.type || "off_site";
  };

  return (
    <Card className="card-modern glass-hover group overflow-hidden animate-slide-in-right">
      <CardHeader className="pb-4 relative z-10">
        <CardTitle className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Sources Activity in{" "}
          {currentPeriod
            ? getPeriodMonthName(
                currentPeriod.from_date,
                currentPeriod.to_date
              )
            : "selected month"}
        </CardTitle>
        <CardDescription className="text-muted-foreground/80">
          Time distribution across sources • {totalHours.toFixed(1)}h total
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 relative z-10">
        {heatmapData.length > 0 ? (
          <div className="space-y-6">
            {/* Heatmap Grid */}
            <div className="border rounded-lg border-border/50 p-4 glass">
              <div className="grid grid-cols-1 gap-4">
                {heatmapData.map((cell, index) => {
                  const intensity = getColorIntensity(cell.hours, maxHours);
                  const sourceType = getSourceType(cell.source);
                  const isOnSite = sourceType === "on_site";

                  return (
                    <div
                      key={cell.source}
                      className="group/cell relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-[1.02]"
                      style={{
                        background: `linear-gradient(135deg,
                          ${isOnSite
                            ? `rgba(34, 197, 94, ${0.1 + intensity * 0.3})`
                            : `rgba(59, 130, 246, ${0.1 + intensity * 0.3})`
                          } 0%,
                          ${isOnSite
                            ? `rgba(34, 197, 94, ${0.05 + intensity * 0.2})`
                            : `rgba(59, 130, 246, ${0.05 + intensity * 0.2})`
                          } 100%)`,
                        border: `1px solid ${isOnSite
                          ? `rgba(34, 197, 94, ${0.2 + intensity * 0.3})`
                          : `rgba(59, 130, 246, ${0.2 + intensity * 0.3})`
                        }`,
                        boxShadow: `0 4px 20px ${isOnSite
                          ? `rgba(34, 197, 94, ${0.1 + intensity * 0.2})`
                          : `rgba(59, 130, 246, ${0.1 + intensity * 0.2})`
                        }`,
                      }}
                    >
                      {/* Background gradient overlay */}
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          background: `linear-gradient(135deg,
                            ${isOnSite
                              ? `rgba(34, 197, 94, ${intensity})`
                              : `rgba(59, 130, 246, ${intensity})`
                            } 0%,
                            transparent 100%)`,
                        }}
                      />

                      <div className="relative z-10 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                isOnSite
                                  ? "bg-green-500 shadow-lg shadow-green-500/50"
                                  : "bg-blue-500 shadow-lg shadow-blue-500/50"
                              }`}
                            />
                            <h3 className="font-semibold text-foreground/90">
                              {cell.source}
                            </h3>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-foreground">
                              {cell.hours.toFixed(1)}h
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {((cell.hours / totalHours) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              isOnSite
                                ? "bg-gradient-to-r from-green-500 to-green-600"
                                : "bg-gradient-to-r from-blue-500 to-blue-600"
                            }`}
                            style={{ width: `${(cell.hours / maxHours) * 100}%` }}
                          />
                        </div>

                        {/* Source type badge */}
                        <div className="mt-3 flex items-center justify-between">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            isOnSite
                              ? "bg-green-500/10 text-green-600 border border-green-500/20"
                              : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                          }`}>
                            {isOnSite ? "On Campus" : "Remote"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDuration(cell.duration)}
                          </span>
                        </div>
                      </div>

                      {/* Hover effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover/cell:opacity-100 transition-opacity duration-300" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg border-border/50 p-3 glass">
                <div className="text-sm text-muted-foreground mb-1">On Campus</div>
                <div className="text-lg font-bold text-green-600">
                  {heatmapData
                    .filter(cell => getSourceType(cell.source) === "on_site")
                    .reduce((sum, cell) => sum + cell.hours, 0)
                    .toFixed(1)}h
                </div>
              </div>
              <div className="border rounded-lg border-border/50 p-3 glass">
                <div className="text-sm text-muted-foreground mb-1">Remote</div>
                <div className="text-lg font-bold text-blue-600">
                  {heatmapData
                    .filter(cell => getSourceType(cell.source) === "off_site")
                    .reduce((sum, cell) => sum + cell.hours, 0)
                    .toFixed(1)}h
                </div>
              </div>
            </div>
          </div>
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
