import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Target, Calendar, Edit2, Check, X } from "lucide-react";
import { AttendancePeriod } from "@/types/attendance";

interface DashboardSummaryCardsProps {
  total: string;
  onSite: string;
  offSite: string;
  currentPeriod?: AttendancePeriod;
}

export function DashboardSummaryCards({
  total,
  currentPeriod,
}: DashboardSummaryCardsProps) {
  const [holidayHours, setHolidayHours] = useState<number>(0);
  const [isEditingHolidays, setIsEditingHolidays] = useState(false);
  const [tempHolidayHours, setTempHolidayHours] = useState<string>("");

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

  const totalMinutes = parseTime(total);

  // Calcul du total effectif (heures travaillées + heures de congés)
  const effectiveTotalMinutes = totalMinutes + holidayHours * 60;
  const totalHours = effectiveTotalMinutes / 60;

  // Calculate remaining hours (140 hours target - total effective hours)
  const remainingHours = Math.max(0, 140 - totalHours);
  const remainingPercentage = (remainingHours / 140) * 100;

  const handleStartEditingHolidays = () => {
    setTempHolidayHours(holidayHours.toString());
    setIsEditingHolidays(true);
  };

  const handleSaveHolidays = () => {
    const parsed = parseFloat(tempHolidayHours);
    if (!isNaN(parsed) && parsed >= 0) {
      setHolidayHours(parsed);
    }
    setIsEditingHolidays(false);
    setTempHolidayHours("");
  };

  const handleCancelEditingHolidays = () => {
    setIsEditingHolidays(false);
    setTempHolidayHours("");
  };

  const getRemainingWorkDays = (): number => {
    if (!currentPeriod) return 0;

    const today = new Date();
    const endDate = new Date(currentPeriod.to_date);

    today.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    if (today > endDate) return 0;

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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 animate-fade-in-up">
      {/* Holiday Hours Card */}
      <Card className="card-modern glass-hover group overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
          <CardTitle className="text-sm font-semibold text-foreground/80">
            Holiday Hours
          </CardTitle>
          <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors duration-300">
            <Calendar className="h-4 w-4 text-purple-500" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex items-center justify-between">
            {isEditingHolidays ? (
              <div className="flex items-center space-x-2 w-full">
                <input
                  type="number"
                  value={tempHolidayHours}
                  onChange={(e) => setTempHolidayHours(e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0"
                  min="0"
                  step="0.5"
                  autoFocus
                />
                <button
                  onClick={handleSaveHolidays}
                  className="p-1 text-green-500 hover:bg-green-500/10 rounded"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={handleCancelEditingHolidays}
                  className="p-1 text-red-500 hover:bg-red-500/10 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-baseline space-x-2">
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                    {holidayHours}h
                  </div>
                </div>
                <button
                  onClick={handleStartEditingHolidays}
                  className="p-1 text-purple-500 hover:bg-purple-500/10 rounded transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Holiday hours taken
          </p>
        </CardContent>
      </Card>

      {/* Total Hours Card */}
      <Card className="card-modern glass-hover group overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
          <CardTitle className="text-sm font-semibold text-foreground/80">
            Total Hours
          </CardTitle>
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
            <Clock className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex items-baseline space-x-2">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {formatHours(effectiveTotalMinutes)}
            </div>
            <div className="text-xs mt-1 text-primary">
              {((totalHours / 140) * 100).toFixed(0)}% of 140 hours
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {total} worked + {holidayHours}h holiday
          </p>
          <div className="mt-3 w-full bg-muted/50 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((totalHours / 140) * 100, 100)}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Remaining Hours Card */}
      <Card className="card-modern glass-hover group overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
          <CardTitle className="text-sm font-semibold text-foreground/80">
            Remaining Hours
          </CardTitle>
          <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors duration-300">
            <Target className="h-4 w-4 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex items-baseline space-x-2">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
              {(() => {
                const remainingSeconds = remainingHours * 3600;
                const hours = Math.floor(remainingSeconds / 3600);
                const minutes = Math.floor((remainingSeconds % 3600) / 60);
                const seconds = Math.floor(remainingSeconds % 60);

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
              })()}
            </div>
            <div className="text-xs mt-1 text-blue-500">
              {remainingPercentage.toFixed(0)}% remaining
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            To reach 140h target
          </p>
          <div className="mt-3 w-full bg-muted/50 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${remainingPercentage}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Remaining hours per day Card */}
      {(() => {
        const remainingWorkDays = getRemainingWorkDays();
        const hoursPerWorkDay =
          remainingWorkDays > 0 ? remainingHours / remainingWorkDays : 0;

        // Formatage des heures par jour
        const formatHoursPerDay = (): string => {
          if (hoursPerWorkDay === 0) return "0h 0m";

          const wholeHours = Math.floor(hoursPerWorkDay);
          const minutes = Math.round((hoursPerWorkDay - wholeHours) * 60);

          if (wholeHours > 0) {
            return `${wholeHours}h ${minutes}m`;
          }
          return `${minutes}m`;
        };

        return (
          <Card className="card-modern glass-hover group overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
              <CardTitle className="text-sm font-semibold text-foreground/80">
                Remaining Hours/Day
              </CardTitle>
              <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors duration-300">
                <Target className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-baseline space-x-2">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                  {formatHoursPerDay()}
                </div>
                <div className="text-xs mt-1 text-green-500">per workday</div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {remainingWorkDays} workdays remaining •{" "}
                {remainingHours.toFixed(1)}h total
              </p>
              <div className="mt-3 w-full bg-muted/50 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min((hoursPerWorkDay / 8) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </CardContent>
          </Card>
        );
      })()}
    </div>
  );
}
