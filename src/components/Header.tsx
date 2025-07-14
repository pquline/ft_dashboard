"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { BarChart, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import React from "react";

interface HeaderProps {
  login: string;
  imageUrl: string;
  months?: { value: string; label: string }[];
  selectedMonth?: string;
  onMonthChange?: (value: string) => void;
}

export function Header({
  login,
  imageUrl,
  months,
  selectedMonth,
  onMonthChange,
}: HeaderProps) {
  const { setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/login";
  };

  const handleThemeChange = (theme: string) => {
    setTheme(theme);
    setDropdownOpen(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <header className="glass border-b border-border/50 backdrop-blur-xl sticky top-0 z-50 w-full animate-fade-in-up shadow-lg">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/" className="group hidden md:block">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/60 dark:bg-[rgba(24,28,40,0.55)] border border-white/10 shadow-2xl rounded-xl flex items-center justify-center group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 btn-modern relative overflow-hidden backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-70 pointer-events-none" />
              <BarChart
                className="w-5 h-5 md:w-6 md:h-6 text-primary drop-shadow-glow"
                strokeWidth={3.5}
              />
            </div>
          </Link>
          <Link href="/" className="group">
            <h1 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-all duration-300">
              ft_dashboard
            </h1>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {/* Month Selector */}
          {months && selectedMonth && onMonthChange && (
            <div className="flex items-center space-x-2">
              <Select value={selectedMonth} onValueChange={onMonthChange}>
                <SelectTrigger className="w-[140px] h-9 bg-white/30 dark:bg-background/10 border border-white/10 backdrop-blur-xl hover:bg-white/50 dark:hover:bg-white/5 transition-all duration-300 shadow-lg text-foreground/90 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-70 pointer-events-none" />
                  <SelectValue className="relative z-10" />
                </SelectTrigger>
                <SelectContent className="dropdown-glass !bg-transparent !border-0 !shadow-none">
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value} className="hover:bg-accent/30 focus:bg-accent/50 transition-all duration-200">
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="User menu"
                aria-haspopup="menu"
                aria-expanded={dropdownOpen}
                className="cursor-pointer"
              >
                <Avatar>
                  <AvatarImage src={imageUrl} alt={login} />
                  <AvatarFallback>
                    {login.charAt(0).toUpperCase() +
                      login.charAt(1).toUpperCase()}
                  </AvatarFallback>
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
                  <DropdownMenuItem onClick={() => handleThemeChange("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleThemeChange("system")}>
                    System
                  </DropdownMenuItem>
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
