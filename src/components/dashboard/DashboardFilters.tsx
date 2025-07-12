import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    <div className="flex flex-col sm:flex-row gap-3 p-4 bg-background/50 backdrop-blur-sm border rounded-lg shadow-sm">
      <div className="flex-1 min-w-0">
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Month</label>
        <Select value={selectedMonth} onValueChange={onMonthChange}>
          <SelectTrigger className="h-9">
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
      <div className="flex-1 min-w-0">
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Source</label>
        <Select value={selectedSource} onValueChange={onSourceChange}>
          <SelectTrigger className="h-9">
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
  );
}
