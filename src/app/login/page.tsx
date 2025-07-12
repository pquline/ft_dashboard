'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Key } from 'lucide-react';

export default function LoginPage() {
  const [sessionCookie, setSessionCookie] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Store the session cookie
      document.cookie = `session=${sessionCookie}; path=/; max-age=86400`; // 24 hours

      // Test the API call
      const response = await fetch('/api/attendance');

      if (response.ok) {
        // Success! Redirect to dashboard
        router.push('/');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to authenticate');
        // Remove invalid cookie
        document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    } catch (err) {
      setError('Network error. Please try again.');
      // Remove invalid cookie
      document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">ft_dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="session">Session Cookie</Label>
              <Input
                id="session"
                type="text"
                placeholder="C00k13fcgq4iwtAC5cpVYsunZYKwDjtnD6nwNsmgjzw"
                value={sessionCookie}
                onChange={(e) => setSessionCookie(e.target.value)}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>How to get your session cookie:</strong>
                <ol className="mt-2 list-decimal list-inside space-y-1 text-sm">
                  <li>Go to <a href="https://dashboard.42paris.fr/attendance" target="_blank" rel="noopener noreferrer" className="underline">42 Dashboard</a></li>
                  <li>Open Developer Tools (F12)</li>
                  <li>Go to Application/Storage → Cookies</li>
                  <li>Copy the value of the "session" cookie</li>
                </ol>
              </AlertDescription>
            </Alert>

            <Button type="submit" variant="outline" className="w-full bg-orange-500 hover:bg-orange-600 font-bold" disabled={isLoading}>
              {isLoading ? 'Authenticating...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
