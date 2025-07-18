import { AttendanceData } from "@/types/attendance";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CalendarHeatmap from "./CalendarHeatmap";

interface AttendanceHeatmapCardProps {
  data: AttendanceData;
}

export function AttendanceHeatmapCard({ data }: AttendanceHeatmapCardProps) {
  // Fallback mock data if attendance is empty
  const hasAttendance = data.attendance && data.attendance.length > 0;
  const mockAttendance = [
    {
      from_date: "2024-01-01",
      to_date: "2024-01-31",
      from_time: null,
      to_time: null,
      prioritize_sources: false,
      from_sources: [],
      from_source_type: null,
      weekdays: null,
      allow_overflow: false,
      total_attendance: "5",
      total_on_site_attendance: "3",
      total_off_site_attendance: "2",
      detailed_attendance: [],
      daily_attendances: [],
    },
    {
      from_date: "2024-02-01",
      to_date: "2024-02-28",
      from_time: null,
      to_time: null,
      prioritize_sources: false,
      from_sources: [],
      from_source_type: null,
      weekdays: null,
      allow_overflow: false,
      total_attendance: "8",
      total_on_site_attendance: "5",
      total_off_site_attendance: "3",
      detailed_attendance: [],
      daily_attendances: [],
    },
    {
      from_date: "2024-03-01",
      to_date: "2024-03-31",
      from_time: null,
      to_time: null,
      prioritize_sources: false,
      from_sources: [],
      from_source_type: null,
      weekdays: null,
      allow_overflow: false,
      total_attendance: "12",
      total_on_site_attendance: "7",
      total_off_site_attendance: "5",
      detailed_attendance: [],
      daily_attendances: [],
    },
  ];
  const attendance = hasAttendance ? data.attendance : mockAttendance;

  // Flatten all daily_attendances from all periods
  const allDailyAttendances = attendance.flatMap(period => period.daily_attendances || []);
  // Only use days with a valid date
  const dailyValues = allDailyAttendances
    .filter(day => day.date)
    .map(day => ({
      date: day.date,
      count: parseFloat(day.total_attendance) || 0,
    }));

  // Find the earliest and latest date for the heatmap range
  const allDates = dailyValues.map(v => v.date).sort();
  const startDate = allDates[0] || attendance[0].from_date;
  const endDate = allDates[allDates.length - 1] || attendance[attendance.length - 1].to_date;

  return (
    <Card className="card-modern glass-hover group overflow-hidden animate-slide-in-right">
      <CardHeader className="pb-4 relative z-10">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Attendance Heatmap
        </CardTitle>
        <CardDescription className="text-muted-foreground/80">
          Hours spent on campus per day
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 relative z-10">
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={dailyValues}
        />
      </CardContent>
    </Card>
  );
}
