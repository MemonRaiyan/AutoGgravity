const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '../apps/dashboard/src/app');

const generatePage = (dirName, title, fetchRoute, dataKey) => {
  const dirPath = path.join(appDir, dirName);
  const compName = title.split(' ').join('');

  const content = `"use client";
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@autogravity/ui';
import { Loader2, AlertCircle } from 'lucide-react';

export default function ` + compName + `Page() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['` + dataKey + `'],
    queryFn: async () => {
      const res = await apiClient.get('` + fetchRoute + `');
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
      <h1 className="text-3xl font-bold tracking-tight">` + title + `</h1>
      
      {(!data || (Array.isArray(data) && data.length === 0) || Object.keys(data).length === 0) ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col h-[200px] items-center justify-center text-muted-foreground mt-6">
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

generatePage('dashboard', 'Dashboard Overview', '/api/queue/metrics', 'overviewMetrics');
generatePage('queue', 'Upload Queue', '/api/queue/metrics', 'queueStatus');
generatePage('uploads', 'Upload History', '/api/videos', 'uploadHistory');
generatePage('channels', 'Connected Channels', '/api/channels', 'channelsData');
generatePage('analytics', 'Analytics', '/api/analytics', 'analyticsData');
generatePage('settings', 'General Settings', '/api/settings', 'settingsData');
generatePage('ai', 'AI Settings', '/api/settings/ai', 'aiSettingsData');

// Fix API Client EOF error by appending newline
const apiClientPath = path.join(__dirname, '../apps/dashboard/src/lib/api-client.ts');
let apiContent = fs.readFileSync(apiClientPath, 'utf8');
if (!apiContent.endsWith('\\n')) {
  fs.writeFileSync(apiClientPath, apiContent + '\\n');
}

console.log("Pages fixed and API client EOF fixed.");
