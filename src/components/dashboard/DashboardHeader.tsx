import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DashboardHeaderProps {
  login: string;
  imageUrl: string;
}

export function DashboardHeader({ login, imageUrl }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={imageUrl} />
          <AvatarFallback>{login.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-xl font-semibold">ft_dashboard</h1>
          <p className="text-sm text-muted-foreground">{login}</p>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span>Live Data</span>
      </div>
    </div>
  );
}
