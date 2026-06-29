"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import Cookies from 'js-cookie';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@autogravity/ui';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/login', { email: 'admin@autogravity.ai', password: 'admin' });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = res.data as any;
      Cookies.set('accessToken', data.accessToken);
      if (data.refreshToken) Cookies.set('refreshToken', data.refreshToken);
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">AutoGravity AI</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input type="email" defaultValue="admin@autogravity.ai" className="w-full px-3 py-2 border rounded-md bg-background" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <input type="password" defaultValue="admin" className="w-full px-3 py-2 border rounded-md bg-background" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
