"use client";

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HeaderProps {
  login: string;
  imageUrl: string;
  months?: { value: string; label: string }[];
  selectedMonth?: string;
  onMonthChange?: (value: string) => void;
  sources?: string[];
  selectedSource?: string;
  onSourceChange?: (value: string) => void;
}

export function Header({
  login,
  imageUrl,
  months,
  selectedMonth,
  onMonthChange,
  sources,
  selectedSource,
  onSourceChange
}: HeaderProps) {
  const { setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    // Remove session cookie
    document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    // Redirect to login page
    window.location.href = '/login';
  };

  if (!mounted) {
    return null;
  }

  return (
    <header className="bg-white dark:bg-secondary/50 backdrop-blur-sm border-b w-full" suppressHydrationWarning>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
                <div className="flex items-center gap-3 w-full md:w-auto">
          <Link href="/">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm md:text-base">FT</span>
            </div>
          </Link>
          <Link href="/" className="text-lg font-semibold">
            <h1 className="text-2xl font-bold text-primary-900 dark:text-primary-100">ft_dashboard</h1>
          </Link>
        </div>

        <div className="flex items-center space-x-6">
          {/* Filters - only show if props are provided */}
          {months && selectedMonth && onMonthChange && sources && selectedSource && onSourceChange && (
            <div className="flex flex-row gap-4 items-center">
              <Select value={selectedMonth} onValueChange={onMonthChange}>
                <SelectTrigger className="w-[120px] h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedSource} onValueChange={onSourceChange}>
                <SelectTrigger className="w-[120px] h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {sources.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="User menu"
                aria-haspopup="menu"
                aria-expanded="false"
                className="cursor-pointer"
              >
                <Avatar>
                  <AvatarImage src={imageUrl} alt={login} />
                  <AvatarFallback>{login.charAt(0).toUpperCase() + login.charAt(1).toUpperCase()}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 mr-4 h-4 w-4" />
                  <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 mr-4 h-4 w-4" />
                  <span>Theme</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4 text-foreground" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
