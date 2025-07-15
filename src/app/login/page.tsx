'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, BarChart } from 'lucide-react';
import Link from 'next/link';

const setCookie = (name: string, value: string, days: number = 1) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));

  const cookieString = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;

  try {
    document.cookie = cookieString;
    if (!document.cookie.includes(name)) {
      document.cookie = `${name}=${value}; path=/`;
    }
  } catch (error) {
    console.warn('Cookie setting failed:', error);
  }
};

const clearCookie = (name: string) => {
  try {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
  } catch (error) {
    console.warn('Cookie clearing failed:', error);
  }
};

const getBrowserInstructions = () => {
  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes('chrome') || userAgent.includes('chromium')) {
    return {
      devTools: 'F12 or Ctrl+Shift+I (Cmd+Option+I on Mac)',
      storage: 'Application tab → Storage → Cookies',
      browser: 'Chrome'
    };
  } else if (userAgent.includes('firefox')) {
    return {
      devTools: 'F12 or Ctrl+Shift+I (Cmd+Option+I on Mac)',
      storage: 'Storage tab → Cookies',
      browser: 'Firefox'
    };
  } else if (userAgent.includes('safari')) {
    return {
      devTools: 'Cmd+Option+I',
      storage: 'Storage tab → Cookies',
      browser: 'Safari'
    };
  } else if (userAgent.includes('edge')) {
    return {
      devTools: 'F12 or Ctrl+Shift+I',
      storage: 'Application tab → Storage → Cookies',
      browser: 'Edge'
    };
  } else {
    return {
      devTools: 'F12 or right-click → Inspect',
      storage: 'Application/Storage → Cookies',
      browser: 'your browser'
    };
  }
};

export default function LoginPage() {
  const [sessionCookie, setSessionCookie] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [browserInfo, setBrowserInfo] = useState(getBrowserInstructions());

  useEffect(() => {
    setBrowserInfo(getBrowserInstructions());
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      setCookie('session', sessionCookie, 1);

      await new Promise(resolve => setTimeout(resolve, 100));

      const response = await fetch('/api/attendance', {
        method: 'GET',
        credentials: 'include', // Include cookies in request
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        window.location.href = '/';
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Failed to authenticate' }));
        setError(errorData.error || 'Failed to authenticate');
        clearCookie('session');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check your connection and try again.');
      clearCookie('session');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4 animate-fade-in-up">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/60 dark:bg-[rgba(24,28,40,0.55)] border border-white/10 shadow-2xl rounded-2xl mb-4 relative overflow-hidden backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-70 pointer-events-none" />
            <BarChart className="w-8 h-8 text-primary drop-shadow-glow" strokeWidth={3.5} />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-2">
            ft_dashboard
          </h1>
        </div>

        <Card className="card-modern group overflow-hidden">
          {/* Lighter glassy hover overlay for dark mode */}
          <div className="absolute inset-0 bg-white/10 dark:bg-[rgba(40,40,60,0.25)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardContent className="relative z-10">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="session" className="text-sm font-semibold text-foreground/80">
                  Session Cookie
                </Label>
                <Input
                  id="session"
                  type="text"
                  placeholder="535510n_c00k13"
                  value={sessionCookie}
                  onChange={(e) => setSessionCookie(e.target.value)}
                  required
                  className="focus-ring transition-all duration-200 bg-card/50 border-border/50 focus:border-primary/50"
                  autoComplete="off"
                  spellCheck="false"
                  aria-describedby="cookie-help"
                />
              </div>

              {error && (
                <Alert variant="destructive" className="border-red-500/20 bg-red-500/10">
                  <AlertDescription className="text-red-600">{error}</AlertDescription>
                </Alert>
              )}

              <Alert className="border-orange-500/20 bg-orange-500/10 w-full !flex !items-start gap-3" id="cookie-help">
                <Info className="h-4 w-4 text-foreground mt-0.5 flex-shrink-0" />
                <AlertDescription className="text-foreground flex-1 min-w-0">
                  <strong className="text-foreground">How to get your session cookie:</strong>
                  <ol className="mt-3 list-decimal list-inside space-y-2 text-sm">
                    <li>
                      Go to{' '}
                      <Link
                        href="https://dashboard.42paris.fr/attendance"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-foreground font-bold hover:underline transition-colors duration-200"
                      >
                        42 Dashboard
                      </Link>
                    </li>
                    <li>Open Developer Tools ({browserInfo.devTools})</li>
                    <li>Go to {browserInfo.storage}</li>
                    <li>Copy the value of the &quot;session&quot; cookie</li>
                  </ol>
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                className="btn-glass w-full font-semibold py-3 transition-all duration-300 focus-ring relative z-10"
                disabled={isLoading}
                aria-describedby={error ? "error-message" : undefined}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" role="status" aria-label="Loading"></div>
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  'Login'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
