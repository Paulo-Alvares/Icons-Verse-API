const express = require('express');
const app = express();

const { generateSvg, parseShortNames } = require('./app.js');
const icons = require('./dist/icons.json');
const iconNameList = [...new Set(Object.keys(icons).map(i => i.split('-')[0]))];

app.get('/icons', (req, res) => {
  const iconParam = req.query.i || req.query.icons;
  if (!iconParam) return res.status(400).send("You didn't specify any icons!");

  const theme = req.query.t || req.query.theme;
  if (theme && theme !== 'dark' && theme !== 'light')
    return res.status(400).send('Theme must be either "light" or "dark"');

  const perLine = req.query.perline || 15;
  if (isNaN(perLine) || perLine < -1 || perLine > 50)
    return res
      .status(400)
      .send('Icons per line must be a number between 1 and 50');

  let iconShortNames = [];
  if (iconParam === 'all') iconShortNames = iconNameList;
  else iconShortNames = iconParam.split(',');

  const iconNames = parseShortNames(iconShortNames, theme || undefined);
  if (!iconNames)
    return res.status(400).send("You didn't format the icons param correctly!");

  const svg = generateSvg(iconNames, perLine);

  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
});

app.get('/api/icons', (req, res) => {
  res.json(iconNameList);
});

app.get('/api/svgs', (req, res) => {
  res.json(icons);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});