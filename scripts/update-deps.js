const fs = require('fs');
const path = require('path');

const dashboardPkg = path.join(__dirname, '../apps/dashboard/package.json');
const pkg = JSON.parse(fs.readFileSync(dashboardPkg, 'utf-8'));

pkg.dependencies["@autogravity/ui"] = "*";
pkg.dependencies["@autogravity/config"] = "*";
pkg.dependencies["@autogravity/shared"] = "*";

fs.writeFileSync(dashboardPkg, JSON.stringify(pkg, null, 2));

const apiPkg = path.join(__dirname, '../apps/api/package.json');
const aPkg = JSON.parse(fs.readFileSync(apiPkg, 'utf-8'));

aPkg.dependencies["@autogravity/config"] = "*";
aPkg.dependencies["@autogravity/shared"] = "*";
aPkg.dependencies["bullmq"] = "^5.7.8";
aPkg.dependencies["swagger-jsdoc"] = "^6.2.8";
aPkg.dependencies["swagger-ui-express"] = "^5.0.0";
aPkg.dependencies["jsonwebtoken"] = "^9.0.2";
aPkg.dependencies["bcrypt"] = "^5.1.1";

fs.writeFileSync(apiPkg, JSON.stringify(aPkg, null, 2));

console.log("Workspace dependencies added.");
