const icons = require("./icons.json");

interface Icons {
  [key: string]: string;
}

const iconNameList: string[] = [
  ...new Set(Object.keys(icons).map((i) => i.split("-")[0])),
];

const shortNames: Icons = {
  js: "javascript",
  ts: "typescript",
  py: "python",
  tailwind: "tailwindcss",
  vue: "vuejs",
  nuxt: "nuxtjs",
  go: "golang",
  cf: "cloudflare",
  wasm: "webassembly",
  postgres: "postgresql",
  k8s: "kubernetes",
  next: "nextjs",
  mongo: "mongodb",
  md: "markdown",
  ps: "photoshop",
  ai: "illustrator",
  pr: "premiere",
  ae: "aftereffects",
  scss: "sass",
  sc: "scala",
  net: "dotnet",
  gatsbyjs: "gatsby",
  gql: "graphql",
  vlang: "v",
  amazonwebservices: "aws",
  bots: "discordbots",
  express: "expressjs",
  googlecloud: "gcp",
  mui: "materialui",
  windi: "windicss",
  unreal: "unrealengine",
  nest: "nestjs",
  ktorio: "ktor",
  pwsh: "powershell",
  au: "audition",
  rollup: "rollupjs",
  rxjs: "reactivex",
  rxjava: "reactivex",
  ghactions: "githubactions",
  sklearn: "scikitlearn",
};

const themedIcons: string[] = [
  ...Object.keys(icons)
    .filter((i) => i.includes("-light") || i.includes("-dark"))
    .map((i) => i.split("-")[0]),
];

const SIZE_MAP: { [key: string]: number } = {
  small: 50,
  normal: 75,
  big: 100,
};
type IconSize = "small" | "normal" | "big";

function generateSvg(
  iconNames: string[],
  perLine: number,
  size: IconSize
): string {
  const baseSize = SIZE_MAP[size] || SIZE_MAP.normal;
  const SCALE = baseSize / (300 - 44);
  const iconSvgList = iconNames.map((i) => icons[i]);

  const length = Math.min(perLine * 300, iconNames.length * 300) - 44;
  const height = Math.ceil(iconSvgList.length / perLine) * 300 - 44;
  const scaledHeight = height * SCALE;
  const scaledWidth = length * SCALE;

  return `
  <svg width="${scaledWidth}" height="${scaledHeight}" viewBox="0 0 ${length} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
    ${iconSvgList
      .map(
        (i, index) =>
          `
        <g transform="translate(${(index % perLine) * 300}, ${
            Math.floor(index / perLine) * 300
          })">
          ${i}
        </g>
        `
      )
      .join(" ")}
  </svg>
  `;
}

function parseShortNames(names: string[], theme: string = ""): string[] {
  return names
    .map((name) => {
      if (iconNameList.includes(name))
        return name + (themedIcons.includes(name) && theme ? `-${theme}` : "");
      else if (name in shortNames)
        return (
          shortNames[name] +
          (themedIcons.includes(shortNames[name]) && theme ? `-${theme}` : "")
        );
      return null;
    })
    .filter((name): name is string => name !== null);
}

export { generateSvg, parseShortNames };
