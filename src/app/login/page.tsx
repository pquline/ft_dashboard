'use client'

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, BarChart } from 'lucide-react';

export default function LoginPage() {
  const [sessionCookie, setSessionCookie] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      document.cookie = `session=${sessionCookie}; path=/; max-age=86400`;
      const response = await fetch('/api/attendance');
      if (response.ok) {
        window.location.href = '/';
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to authenticate');
        document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    } catch {
      setError('Network error. Please try again.');
      document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
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
                />
              </div>

              {error && (
                <Alert variant="destructive" className="border-red-500/20 bg-red-500/10">
                  <AlertDescription className="text-red-600">{error}</AlertDescription>
                </Alert>
              )}

              <Alert className="border-orange-500/20 bg-orange-500/10">
                <Info className="h-4 w-4 text-foreground" />
                <AlertDescription className="text-foreground">
                  <strong className="text-foreground">How to get your session cookie:</strong>
                  <ol className="mt-3 list-decimal list-inside space-y-2 text-sm">
                    <li>
                      Go to{' '}
                      <a
                        href="https://dashboard.42paris.fr/attendance"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-foreground/50 hover:underline transition-colors duration-200"
                      >
                        <span>42 Dashboard</span>
                      </a>
                    </li>
                    <li>Open Developer Tools (F12)</li>
                    <li>Go to Application/Storage → Cookies</li>
                    <li>Copy the value of the "session" cookie</li>
                  </ol>
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                className="btn-glass w-full font-semibold py-3 transition-all duration-300 focus-ring relative z-10"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
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
