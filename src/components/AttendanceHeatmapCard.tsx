import { AttendanceData } from "@/types/attendance";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CalendarHeatmap from "./CalendarHeatmap";

interface AttendanceHeatmapCardProps {
  data: AttendanceData;
}

export function AttendanceHeatmapCard({ data }: AttendanceHeatmapCardProps) {
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
          startDate={data.attendance[0].from_date}
          endDate={data.attendance[data.attendance.length - 1].to_date}
          values={data.attendance.map((period) => ({
            date: period.from_date,
            count: parseFloat(period.total_attendance) || 0,
          }))}
        />
      </CardContent>
    </Card>
  );
}
