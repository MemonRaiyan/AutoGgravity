const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const uiDir = path.join(rootDir, 'packages', 'ui');
const dashboardDir = path.join(rootDir, 'apps', 'dashboard');

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  fs.readdirSync(src, { withFileTypes: true }).forEach(dirent => {
    const srcPath = path.join(src, dirent.name);
    const destPath = path.join(dest, dirent.name);
    if (dirent.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// Ensure ui/src exists
fs.mkdirSync(path.join(uiDir, 'src'), { recursive: true });

// Copy dashboard components and lib to ui
copyDir(path.join(dashboardDir, 'src', 'components'), path.join(uiDir, 'src', 'components'));
copyDir(path.join(dashboardDir, 'src', 'lib'), path.join(uiDir, 'src', 'lib'));

// Create an index file exporting all UI elements
fs.writeFileSync(path.join(uiDir, 'src', 'index.ts'), `
export * from "./components/layout/sidebar";
export * from "./components/layout/navbar";
export * from "./components/providers/theme-provider";
export * from "./lib/utils";
`);

// Optionally we'll leave them in dashboard and delete them later after refactoring,
// or just delete them now if we configure it correctly.

console.log("UI components moved to packages/ui.");
