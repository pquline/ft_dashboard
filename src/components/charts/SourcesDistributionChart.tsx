"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/utils";

interface SourcesDistributionChartProps {
  sourceData: Array<{
    name: string;
    value: number;
    type: "none";
  }>;
}

export function SourcesDistributionChart({ sourceData }: SourcesDistributionChartProps) {
  if (!sourceData || sourceData.length === 0) {
    return (
      <Card className="card-modern glass-hover group overflow-hidden">
        <CardHeader className="pb-4 relative z-10">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Sources Distribution
          </CardTitle>
          <CardDescription className="text-muted-foreground/80">
            No attendance data available
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 relative z-10">
          <div className="text-center py-8 text-muted-foreground">
            No sources data to display
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalHours = sourceData.reduce((sum, source) => sum + source.value, 0);

  const getSourceColor = (sourceName: string) => {
    switch (sourceName.toLowerCase()) {
      case 'discord':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/30';
      case 'sipass':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      case 'desk-made':
        return 'bg-green-500/10 text-green-500 border-green-500/30';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
    }
  };

  return (
    <Card className="card-modern glass-hover group overflow-hidden animate-slide-in-right">
      <CardHeader className="pb-4 relative z-10">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Sources Distribution
        </CardTitle>
        <CardDescription className="text-muted-foreground/80">
          Attendance breakdown by source
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 relative z-10">
        <div className="space-y-4">
          {sourceData.map((source) => {
            const percentage = totalHours > 0 ? (source.value / totalHours) * 100 : 0;
            const hours = Math.floor(source.value);
            const minutes = Math.round((source.value - hours) * 60);

            return (
              <div key={source.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30">
                <div className="flex items-center space-x-3">
                  <Badge
                    variant="outline"
                    className={`${getSourceColor(source.name)} font-medium`}
                  >
                    {source.name}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    {hours}h {minutes}m
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-sm font-semibold text-foreground">
                    {percentage.toFixed(1)}%
                  </div>
                  <div className="w-16 h-2 bg-muted/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-border/30">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Total Hours:</span>
            <span className="font-semibold text-foreground">
              {Math.floor(totalHours)}h {Math.round((totalHours - Math.floor(totalHours)) * 60)}m
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
