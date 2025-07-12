import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface DashboardFiltersProps {
  months: { value: string; label: string }[];
  selectedMonth: string;
  onMonthChange: (value: string) => void;
  sources: string[];
  selectedSource: string;
  onSourceChange: (value: string) => void;
}

export function DashboardFilters({
  months,
  selectedMonth,
  onMonthChange,
  sources,
  selectedSource,
  onSourceChange,
}: DashboardFiltersProps) {
  return (
    <Card className="border-0 shadow-sm bg-background/50 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Filters:</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="flex items-center gap-2 min-w-0">
              <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">Month</label>
              <Select value={selectedMonth} onValueChange={onMonthChange}>
                <SelectTrigger className="w-[180px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">Source</label>
              <Select value={selectedSource} onValueChange={onSourceChange}>
                <SelectTrigger className="w-[140px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {sources.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source.charAt(0).toUpperCase() + source.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
