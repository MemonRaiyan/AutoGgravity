const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '../apps/dashboard/src/app');
if (!fs.existsSync(appDir)) fs.mkdirSync(appDir, { recursive: true });

const generatePage = (dirName, title, fetchRoute, dataKey) => {
  const dirPath = path.join(appDir, dirName);
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

  const content = `"use client";
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@autogravity/ui';
import { Loader2, AlertCircle } from 'lucide-react';

export default function \${title.replace(/\\s/g, '')}Page() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['\${dataKey}'],
    queryFn: async () => {
      const res = await apiClient.get('\${fetchRoute}');
      return res.data;
    }
  });

  if (isLoading) return (
    <div className="flex h-[400px] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  if (isError) return (
    <div className="flex flex-col h-[400px] items-center justify-center text-destructive">
      <AlertCircle className="h-8 w-8 mb-4" />
      <p>Failed to load data. Please ensure the backend is running and you are logged in.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">\${title}</h1>
      
      {(!data || (Array.isArray(data) && data.length === 0) || Object.keys(data).length === 0) ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col h-[200px] items-center justify-center text-muted-foreground">
            <p>No data available</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Raw Data Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-auto max-h-[300px]">
                {JSON.stringify(data, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
`;
  fs.writeFileSync(path.join(dirPath, 'page.tsx'), content);
};

// Overview/Dashboard
generatePage('dashboard', 'Dashboard Overview', '/api/queue/metrics', 'overviewMetrics');
// Queue
generatePage('queue', 'Upload Queue', '/api/queue/metrics', 'queueStatus');
// Uploads
generatePage('uploads', 'Upload History', '/api/videos', 'uploadHistory');
// Channels
generatePage('channels', 'Connected Channels', '/api/channels', 'channelsData');
// Analytics
generatePage('analytics', 'Analytics', '/api/analytics', 'analyticsData');
// Settings
generatePage('settings', 'General Settings', '/api/settings', 'settingsData');
// AI
generatePage('ai', 'AI Settings', '/api/settings/ai', 'aiSettingsData');

// Login page is special, doesn't use standard fetch
const loginDirPath = path.join(appDir, 'login');
if (!fs.existsSync(loginDirPath)) fs.mkdirSync(loginDirPath, { recursive: true });
fs.writeFileSync(path.join(loginDirPath, 'page.tsx'), `"use client";
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
      Cookies.set('accessToken', res.data.accessToken);
      if (res.data.refreshToken) Cookies.set('refreshToken', res.data.refreshToken);
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
`);

console.log('Generated dashboard pages.');
