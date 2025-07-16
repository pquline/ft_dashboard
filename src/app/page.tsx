import { cookies } from 'next/headers';
import { AttendanceData } from '@/types/attendance';
import { CachedDashboardClient } from '@/components/CachedDashboardClient';
import { DashboardSkeleton } from '@/components/DashboardSkeleton';
import { Suspense } from 'react';

async function fetchAttendanceData(sessionCookie: string): Promise<AttendanceData> {
  const response = await fetch('https://dashboard.42paris.fr/api/attendance', {
    headers: {
      'accept': '*/*',
      'accept-language': 'en-US,en;q=0.9',
      'cookie': `session=${sessionCookie}`,
      'referer': 'https://dashboard.42paris.fr/attendance',
      'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch attendance data: ${response.status}`);
  }

  return response.json();
}

async function DashboardContent() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) {
    throw new Error('Session cookie not found');
  }

  const data = await fetchAttendanceData(sessionCookie);
  const defaultMonth = data.attendance[0]?.from_date || '';

  return (
    <CachedDashboardClient
      initialData={data}
      defaultMonth={defaultMonth}
      login={data.login}
      imageUrl={data.image_url}
    />
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
