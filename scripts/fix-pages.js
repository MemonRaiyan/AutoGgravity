const fs = require('fs');
const path = require('path');

const dashboardApp = path.join(__dirname, '../apps/dashboard/app');
const pages = ['dashboard', 'uploads', 'queue', 'analytics', 'channels', 'ai', 'scheduler', 'logs', 'settings', 'login'];

for (const page of pages) {
  const dir = path.join(dashboardApp, page);
  const componentName = page.charAt(0).toUpperCase() + page.slice(1) + 'Page';
  const content = `export default function ${componentName}() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold capitalize">${page}</h1>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(dir, 'page.tsx'), content);
}

console.log('Fixed Dashboard pages syntax.');
