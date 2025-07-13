import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AttendanceData, SourceType } from "@/types/attendance";
import { useInteractiveBackground } from "@/hooks/useInteractiveBackground";

interface DashboardLayoutProps {
  children: React.ReactNode;
  data: AttendanceData;
  months: Array<{ value: string; label: string }>;
  selectedMonth: string;
  availableSources: string[];
  selectedSource: SourceType;
  onMonthChange: (newMonth: string) => void;
  onSourceChange: (value: string) => void;
}

export function DashboardLayout({
  children,
  data,
  months,
  selectedMonth,
  availableSources,
  selectedSource,
  onMonthChange,
  onSourceChange,
}: DashboardLayoutProps) {
  useInteractiveBackground();
  return (
    <div className="min-h-screen gradient-bg interactive-bg">
      <Header
        login={data.login}
        imageUrl={data.image_url}
        months={months}
        selectedMonth={selectedMonth}
        onMonthChange={onMonthChange}
        sources={availableSources}
        selectedSource={selectedSource}
        onSourceChange={onSourceChange}
      />
      <div className="relative z-10">
        {children}
      </div>
      <div className="mt-12 relative z-10">
        <Footer />
      </div>
    </div>
  );
}
