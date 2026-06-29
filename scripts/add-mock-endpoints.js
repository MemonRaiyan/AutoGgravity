const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../apps/api/src');
const serverPath = path.join(srcDir, 'server.ts');

let serverContent = fs.readFileSync(serverPath, 'utf8');

// Quick API mocks for missing endpoints
if (!serverContent.includes('/api/videos')) {
  serverContent = serverContent.replace(
    "const app = express();",
    "const app = express();\n\napp.get('/api/videos', (req, res) => { res.json([{ id: 1, title: 'Test Video', status: 'COMPLETED' }]); });\napp.get('/api/analytics', (req, res) => { res.json({ uploads: 5, views: 1000 }); });\napp.get('/api/settings', (req, res) => { res.json({ theme: 'dark' }); });\napp.get('/api/settings/ai', (req, res) => { res.json({ provider: 'OpenRouter' }); });\n"
  );
  fs.writeFileSync(serverPath, serverContent);
}

console.log("Mock endpoints added to server.");
