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
import { Calendar, LogOut, Moon, Server, Sun, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';

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
    document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.href = '/login';
  };

  if (!mounted) {
    return null;
  }

  return (
    <header className="glass border-b border-border/50 backdrop-blur-xl sticky top-0 z-50 w-full animate-fade-in-up">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/" className="group">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 btn-modern">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
            </div>
          </Link>
          <Link href="/" className="group">
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/80 transition-all duration-300">
              ft_dashboard
            </h1>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {/* Quick Stats Display */}
          <div className="hidden md:flex items-center space-x-3 px-4 py-2 rounded-lg bg-card/50 border border-border/30">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-slow"></div>
              <span className="text-sm font-medium text-foreground/80">Live</span>
            </div>
            <div className="w-px h-4 bg-border/50"></div>
            <span className="text-sm text-muted-foreground">{login}</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="User menu"
                aria-haspopup="menu"
                aria-expanded="false"
                className="cursor-pointer group focus-ring"
              >
                <div className="relative">
                  <Avatar className="w-10 h-10 ring-2 ring-border/30 group-hover:ring-primary/50 transition-all duration-300 group-hover:scale-105">
                    <AvatarImage src={imageUrl} alt={login} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
                      {login.charAt(0).toUpperCase() + login.charAt(1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass border-border/50 backdrop-blur-xl animate-slide-in-right">
              {/* Month Selector */}
              {months && selectedMonth && onMonthChange && (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="focus-ring">
                    <Calendar className="mr-3 h-4 w-4" />
                    <span>Month</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="glass border-border/50 backdrop-blur-xl">
                    {months.map((month) => (
                      <DropdownMenuItem
                        key={month.value}
                        onClick={() => onMonthChange(month.value)}
                        className={`focus-ring transition-all duration-200 ${
                          selectedMonth === month.value
                            ? "bg-primary/10 text-primary border-l-2 border-primary"
                            : "hover:bg-accent/50"
                        }`}
                      >
                        {month.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              )}

              {/* Source Selector */}
              {sources && selectedSource && onSourceChange && (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="focus-ring">
                    <Server className="mr-3 h-4 w-4" />
                    <span>Source</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="glass border-border/50 backdrop-blur-xl">
                    <DropdownMenuItem
                      onClick={() => onSourceChange("all")}
                      className={`focus-ring transition-all duration-200 ${
                        selectedSource === "all"
                          ? "bg-primary/10 text-primary border-l-2 border-primary"
                          : "hover:bg-accent/50"
                      }`}
                    >
                      All Sources
                    </DropdownMenuItem>
                    {sources.map((source) => (
                      <DropdownMenuItem
                        key={source}
                        onClick={() => onSourceChange(source)}
                        className={`focus-ring transition-all duration-200 ${
                          selectedSource === source
                            ? "bg-primary/10 text-primary border-l-2 border-primary"
                            : "hover:bg-accent/50"
                        }`}
                      >
                        {source}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              )}

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="focus-ring">
                  <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 mr-3 h-4 w-4" />
                  <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 mr-3 h-4 w-4" />
                  <span>Theme</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="glass border-border/50 backdrop-blur-xl">
                  <DropdownMenuItem
                    onClick={() => setTheme("light")}
                    className="focus-ring hover:bg-accent/50 transition-all duration-200"
                  >
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setTheme("dark")}
                    className="focus-ring hover:bg-accent/50 transition-all duration-200"
                  >
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setTheme("system")}
                    className="focus-ring hover:bg-accent/50 transition-all duration-200"
                  >
                    System
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem
                onClick={handleLogout}
                className="focus-ring hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
