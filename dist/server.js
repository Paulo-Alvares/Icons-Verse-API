"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app_1 = require("./app");
const icons = require("./icons.json");
const app = (0, express_1.default)();
const iconNameList = [
    ...new Set(Object.keys(icons).map((i) => i.split("-")[0])),
];
app.get("/icons", ((req, res) => {
    const iconParam = req.query.i || req.query.icons;
    if (!iconParam)
        return res.status(400).send("You didn't specify any icons!");
    const theme = req.query.t || req.query.theme;
    if (theme && theme !== "dark" && theme !== "light" && theme !== "colorful") {
        return res
            .status(400)
            .send('Theme must be either "colorful", "dark" or "light"');
    }
    const perLine = parseInt(req.query.perline || "15", 10);
    if (isNaN(perLine) || perLine < 1 || perLine > 50) {
        return res
            .status(400)
            .send("Icons per line must be a number between 1 and 50");
    }
    const size = req.query.size || "small";
    if (!["small", "normal", "big"].includes(size)) {
        return res.status(400).send('Size must be "small", "normal", or "big"');
    }
    let iconShortNames = [];
    if (iconParam === "all") {
        iconShortNames = iconNameList;
    }
    else {
        iconShortNames = iconParam.split(",");
    }
    const iconNames = (0, app_1.parseShortNames)(iconShortNames, theme || undefined);
    if (!iconNames) {
        return res.status(400).send("You didn't format the icons param correctly!");
    }
    const svg = (0, app_1.generateSvg)(iconNames, perLine, size);
    res.setHeader("Content-Type", "image/svg+xml");
    res.send(svg);
}));
app.get("/api/icons", (_req, res) => {
    res.json(iconNameList);
});
app.get("/api/svgs", (_req, res) => {
    res.json(icons);
});
app.listen(3000, () => {
    console.log(`Server is running: http://localhost:3000/icons?i=html,css,nodejs`);
});
