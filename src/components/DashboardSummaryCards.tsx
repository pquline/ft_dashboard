import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Target, Calendar, Edit2, Check, X } from "lucide-react";
import { getCookie, setCookie } from "@/lib/utils";
import { DashboardSummaryCardsProps } from "@/types/attendance";

export function DashboardSummaryCards({
  total,
  currentPeriod,
}: DashboardSummaryCardsProps) {
  const [holidayDays, setHolidayDays] = useState<number>(0);
  const [isEditingHolidays, setIsEditingHolidays] = useState(false);
  const [tempHolidayDays, setTempHolidayDays] = useState<string>("");

  useEffect(() => {
    const savedHolidayDays = getCookie("holidayDays");
    if (savedHolidayDays !== null) {
      const parsed = parseFloat(savedHolidayDays);
      if (!isNaN(parsed) && parsed >= 0) {
        setHolidayDays(parsed);
      }
    }
  }, []);

  useEffect(() => {
    setCookie("holidayDays", holidayDays.toString());
  }, [holidayDays]);

  const parseTime = (timeStr: string) => {
    const match = timeStr.match(/(\d+)h\s*(\d+)m/);
    if (match) {
      return parseInt(match[1]) * 60 + parseInt(match[2]);
    }
    return 0;
  };

  const formatHours = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  const formatHoursPrecise = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const seconds = Math.floor((minutes % 1) * 60);

    if (hours > 0) {
      if (mins > 0) {
        return `${hours}h ${mins}m ${seconds}s`;
      }
      return `${hours}h ${seconds}s`;
    }
    if (mins > 0) {
      return `${mins}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  const totalMinutes = parseTime(total);
  const holidayHours = holidayDays * 5;
  const holidayMinutes = holidayHours * 60;
  const effectiveTotalMinutes = totalMinutes + holidayMinutes;
  const totalHours = effectiveTotalMinutes / 60;
  const remainingHours = Math.max(0, 140 - totalHours);
  const remainingPercentage = (remainingHours / 140) * 100;

  const handleStartEditingHolidays = () => {
    setTempHolidayDays(holidayDays.toString());
    setIsEditingHolidays(true);
  };

  const handleSaveHolidays = () => {
    const parsed = parseFloat(tempHolidayDays);
    if (!isNaN(parsed) && parsed >= 0) {
      setHolidayDays(parsed);
    }
    setIsEditingHolidays(false);
    setTempHolidayDays("");
  };

  const handleCancelEditingHolidays = () => {
    setIsEditingHolidays(false);
    setTempHolidayDays("");
  };

  const getRemainingWorkDays = (): number => {
    if (!currentPeriod) return 0;

    const today = new Date();
    const endDate = new Date(currentPeriod.to_date);

    const startDate = new Date(today);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    if (startDate > endDate) return 0;

    let workDays = 0;
    const current = new Date(today);

    while (current <= endDate) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        workDays++;
      }
      current.setDate(current.getDate() + 1);
    }

    return workDays;
  };

  const remainingWorkDays = getRemainingWorkDays();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-in-up">
      {/* Remaining Hours Card - Red */}
      <Card className="card-modern glass-hover group overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
          <CardTitle className="text-sm font-semibold text-foreground/80">
            Remaining Hours
          </CardTitle>
          <div className="p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors duration-300">
            <Target className="h-4 w-4 text-red-500" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex items-baseline space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              {formatHours(remainingHours * 60)}
            </div>
            <div className="text-xs mt-1 text-red-500">
              {formatHours(remainingHours * 60 / remainingWorkDays) || 0} per workday
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {remainingWorkDays} workdays left before the end of the month
          </p>

          {/* Remaining Hours Progress Bar */}
          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-red-600">Progress to 140h</span>
              <span className="text-red-600">{((totalHours / 140) * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-muted/50 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((totalHours / 140) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Hours Card - Green */}
      <Card className="card-modern glass-hover group overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
          <CardTitle className="text-sm font-semibold text-foreground/80">
            Total Hours
          </CardTitle>
          <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors duration-300">
            <Clock className="h-4 w-4 text-green-500" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex items-baseline space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
              {formatHours(effectiveTotalMinutes)}
            </div>
            <div className="text-xs mt-1 text-green-500">
              {((totalHours / 140) * 100).toFixed(0)}% of 140 hours
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {formatHours(totalMinutes)} (work) + {formatHours(holidayMinutes)} (holidays)
          </p>

          {/* Combined Progress Bar */}
          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-green-600">Work Hours</span>
              <span className="text-purple-600">Holiday Hours</span>
            </div>
            <div className="w-full bg-muted/50 rounded-full h-2 flex overflow-hidden">
              {/* Work Hours (Green) */}
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-2 transition-all duration-500"
                style={{ width: `${Math.min((totalMinutes / 60 / 140) * 100, 100)}%` }}
              ></div>
              {/* Holiday Hours (Purple) */}
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 transition-all duration-500"
                style={{ width: `${Math.min((holidayMinutes / 60 / 140) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Holiday Days Card - Purple */}
      <Card className="card-modern glass-hover group overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
          <CardTitle className="text-sm font-semibold text-foreground/80">
            Holidays
          </CardTitle>
          <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors duration-300">
            <Calendar className="h-4 w-4 text-purple-500" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          {isEditingHolidays ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={tempHolidayDays}
                  onChange={(e) => setTempHolidayDays(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 dark:bg-gray-800/50"
                  placeholder="0"
                  min="0"
                  step="0.5"
                  autoFocus
                />
                <button
                  onClick={handleSaveHolidays}
                  className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors duration-200"
                  title="Save"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={handleCancelEditingHolidays}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
                  title="Cancel"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Days Section */}
              <div className="flex items-center justify-between m-0">
                <div className="flex items-baseline space-x-2">
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                    {holidayDays} day{holidayDays === 1 ? "" : "s"}
                  </div>
                  <div className="text-xs mt-1 text-purple-500">
                    {formatHours(holidayMinutes)}
                  </div>
                </div>
                <button
                  onClick={handleStartEditingHolidays}
                  className="p-2 text-purple-500 hover:bg-purple-500/10 rounded-lg transition-colors duration-200"
                  title="Edit holidays"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                One day is 5 hours
              </p>

              {/* Holiday Allowance Progress Bar */}
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-purple-600">Annual Allowance</span>
                  <span className="text-purple-600">{holidayDays}/35 days</span>
                </div>
                <div className="w-full bg-muted/50 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((holidayDays / 35) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
