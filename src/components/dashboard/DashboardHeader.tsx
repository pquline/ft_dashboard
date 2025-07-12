import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DashboardHeaderProps {
  login: string;
  imageUrl: string;
}

export function DashboardHeader({ login, imageUrl }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-4">
        <Avatar>
            <AvatarFallback>LOGO</AvatarFallback>
        </Avatar>
        <h1 className="text-xl font-bold font-mono">ft_dashboard</h1>
      </div>
      <Avatar>
        <AvatarImage src={imageUrl} alt={login} width={15} height={15} />
        <AvatarFallback>{login.charAt(0).toUpperCase() + login.charAt(1).toUpperCase()}</AvatarFallback>
      </Avatar>
    </div>
  );
}
