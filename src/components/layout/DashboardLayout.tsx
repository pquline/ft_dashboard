import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AttendanceData } from "@/types/attendance";
import { useInteractiveBackground } from "@/hooks/useInteractiveBackground";

interface DashboardLayoutProps {
  children: React.ReactNode;
  data: AttendanceData;
  months: Array<{ value: string; label: string }>;
  selectedMonth: string;
  onMonthChange: (newMonth: string) => void;
}

export function DashboardLayout({
  children,
  data,
  months,
  selectedMonth,
  onMonthChange,
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
