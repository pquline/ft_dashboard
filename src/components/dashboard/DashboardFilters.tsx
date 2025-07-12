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
    <div className="flex flex-row flex-wrap gap-2 sm:gap-4 items-center justify-center">
      <Select value={selectedMonth} onValueChange={onMonthChange}>
        <SelectTrigger className="w-[120px] h-8 text-sm">
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
      <Select value={selectedSource} onValueChange={onSourceChange}>
        <SelectTrigger className="w-[120px] h-8 text-sm">
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
  );
}
