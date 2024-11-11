import express, { Request, Response } from "express";
import { generateSvg, parseShortNames } from "./app";
const icons = require("./icons.json");

const app = express();

const iconNameList: string[] = [
  ...new Set(Object.keys(icons).map((i) => i.split("-")[0])),
];

interface IconRequestQuery {
  i?: string;
  icons?: string;
  t?: string;
  theme?: "dark" | "light" | "colorful";
  perline?: string;
  size?: "small" | "normal" | "big";
}

app.get("/icons", ((req, res) => {
  const iconParam = req.query.i || req.query.icons;
  if (!iconParam) return res.status(400).send("You didn't specify any icons!");

  const theme = req.query.t || req.query.theme;
  if (theme && theme !== "dark" && theme !== "light" && theme !== "colorful") {
    return res
      .status(400)
      .send('Theme must be either "colorful", "dark" or "light"');
  }

  const perLine = parseInt((req.query.perline as string) || "15", 10);
  if (isNaN(perLine) || perLine < 1 || perLine > 50) {
    return res
      .status(400)
      .send("Icons per line must be a number between 1 and 50");
  }

  const size = (req.query.size as string) || "small";
  if (!["small", "normal", "big"].includes(size)) {
    return res.status(400).send('Size must be "small", "normal", or "big"');
  }

  let iconShortNames: string[] = [];
  if (iconParam === "all") {
    iconShortNames = iconNameList;
  } else {
    iconShortNames = (iconParam as string).split(",");
  }

  const iconNames = parseShortNames(iconShortNames, theme || undefined);
  if (!iconNames) {
    return res.status(400).send("You didn't format the icons param correctly!");
  }

  const svg = generateSvg(
    iconNames,
    perLine,
    size as "small" | "normal" | "big"
  );

  res.setHeader("Content-Type", "image/svg+xml");
  res.send(svg);
}) as express.RequestHandler);

app.get("/api/icons", (_req: Request, res: Response) => {
  res.json(iconNameList);
});

app.get("/api/svgs", (_req: Request, res: Response) => {
  res.json(icons);
});

app.listen(3000, () => {
  console.log(
    `Server is running: http://localhost:3000/icons?i=html,css,nodejs`
  );
});
