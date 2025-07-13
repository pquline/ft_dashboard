'use client'

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Sparkles, Shield, ExternalLink } from 'lucide-react';

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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg mb-4">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-2">
            ft_dashboard
          </h1>
          <p className="text-muted-foreground">Your 42 Paris attendance analytics</p>
        </div>

        <Card className="card-modern group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="text-center relative z-10">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Secure Login
              </CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">Enter your session cookie to access your dashboard</p>
          </CardHeader>
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

              <Alert className="border-blue-500/20 bg-blue-500/10">
                <Info className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-blue-600">
                  <strong className="text-blue-700">How to get your session cookie:</strong>
                  <ol className="mt-3 list-decimal list-inside space-y-2 text-sm">
                    <li>
                      Go to{' '}
                      <a
                        href="https://dashboard.42paris.fr/attendance"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 underline transition-colors duration-200"
                      >
                        <span>42 Dashboard</span>
                        <ExternalLink className="h-3 w-3" />
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
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold py-3 transition-all duration-300 btn-modern focus-ring"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  'Login to Dashboard'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-muted-foreground">
          <p>Secure • Private • Open Source</p>
        </div>
      </div>
    </div>
  );
}
