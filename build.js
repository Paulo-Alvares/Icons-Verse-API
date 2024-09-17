const fs = require('fs');
const iconsDirectory = fs.readdirSync('./icons');
const iconsFile = {};

for (const icon of iconsDirectory) {
  const name = icon.replace('.svg', '').toLowerCase();
  iconsFile[name] = String(fs.readFileSync(`./icons/${icon}`));
}

if (!fs.existsSync('./dist')) fs.mkdirSync('./dist');

fs.writeFileSync('./dist/icons.json', JSON.stringify(iconsFile));
