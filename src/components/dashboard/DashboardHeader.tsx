import React from 'react';

interface DashboardHeaderProps {
  login: string;
  imageUrl: string;
}

export function DashboardHeader({ login, imageUrl }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <img
          src={imageUrl}
          alt={`${login} avatar`}
          className="w-10 h-10 rounded-full ring-2 ring-primary/10"
        />
        <div>
          <h1 className="text-xl font-semibold">Attendance Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, {login}</p>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span>Live Data</span>
      </div>
    </div>
  );
}
