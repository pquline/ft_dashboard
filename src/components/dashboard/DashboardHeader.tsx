import React from 'react';

interface DashboardHeaderProps {
  login: string;
  imageUrl: string;
}

export function DashboardHeader({ login, imageUrl }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">ft_dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {login}</p>
      </div>
      <div className="flex items-center space-x-2">
        <img
          src={imageUrl}
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
      </div>
    </div>
  );
}
