export interface DetailedAttendance {
  name: string;
  campus_id: number;
  type: 'on_site' | 'off_site';
  duration: string;
}

export interface TimePeriod {
  begin_at: string;
  end_at: string;
}

export interface IndividualSession {
  campus_id: number;
  source: string;
  time_period: TimePeriod;
}

export interface DailyAttendance {
  day: string;
  date: string;
  total_attendance: string;
  total_on_site_attendance: string;
  total_off_site_attendance: string;
}

export interface AttendancePeriod {
  from_date: string;
  to_date: string;
  from_time: string | null;
  to_time: string | null;
  prioritize_sources: boolean;
  from_sources: string[];
  from_source_type: string | null;
  weekdays: string[] | null;
  allow_overflow: boolean;
  total_attendance: string;
  total_on_site_attendance: string;
  total_off_site_attendance: string;
  detailed_attendance: DetailedAttendance[];
  daily_attendances: DailyAttendance[];
  entries?: IndividualSession[];
}

export interface AttendanceData {
  $schema: string;
  login: string;
  image_url: string;
  attendance: AttendancePeriod[];
}

export type SourceType = 'sipass' | 'desk-made' | 'discord' | 'locations' | 'all';

export interface DashboardSummaryCardsProps {
  total: string;
  onSite: string;
  offSite: string;
  currentPeriod?: AttendancePeriod;
}
