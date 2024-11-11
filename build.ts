import * as fs from "fs";
import * as path from "path";

const iconsDirectory = fs.readdirSync("./icons");
const iconsFile: { [key: string]: string } = {};

for (const icon of iconsDirectory) {
  const name = icon.replace(".svg", "").toLowerCase();
  iconsFile[name] = fs.readFileSync(path.join("./icons", icon), "utf-8");
}

if (!fs.existsSync("./dist")) {
  fs.mkdirSync("./dist");
}

fs.writeFileSync("./icons.json", JSON.stringify(iconsFile, null, 2));
