import { AttendanceData } from "@/types/attendance";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface AttendanceHeatmapCardProps {
  data: AttendanceData;
}

export function AttendanceHeatmapCard({ data }: AttendanceHeatmapCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Heatmap</CardTitle>
      </CardHeader>
    </Card>
  );
}
