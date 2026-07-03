import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");
const templatePath = path.join(distDir, "index.html");

const registry = JSON.parse(await fs.readFile(path.join(distDir, "data/registry.json"), "utf-8"));
const writingSlugs = [
  "agent-skills-at-scale",
  "how-i-built-skill-auditor",
  "authoring-conventions-v2",
  "skills-house-distribution-rfc",
];

function getStaticRoutes() {
  return [
    "/",
    "/platform",
    "/skills",
    "/scripts",
    "/graph",
    "/search",
    "/writing",
    ...registry.skills.map((s) => `/skills/${s.id}`),
    ...registry.scripts.map((s) => `/scripts/${s.id}`),
    ...writingSlugs.map((slug) => `/writing/${slug}`),
  ];
}

function routeToFilePath(route) {
  if (route === "/") return "index.html";
  return `${route.slice(1)}/index.html`;
}

function splitHeadFromBody(appHtml) {
  const headTags = [];
  let body = appHtml;

  const patterns = [
    /<title[^>]*>[\s\S]*?<\/title>/g,
    /<meta[^>]*>/g,
    /<link rel="canonical"[^>]*>/g,
  ];

  for (const pattern of patterns) {
    const matches = body.match(pattern) ?? [];
    headTags.push(...matches);
    body = body.replace(pattern, "");
  }

  return { head: headTags.join(""), body };
}

const { render } = await import("../dist/server/entry-server.js");

const template = await fs.readFile(templatePath, "utf-8");
const routes = getStaticRoutes();

for (const route of routes) {
  const { html: appHtml } = render(route);
  const { head, body } = splitHeadFromBody(appHtml);
  const depth = route === "/" ? 0 : route.split("/").length - 1;
  const assetPrefix = depth === 0 ? "./" : "../".repeat(depth);

  let html = template;
  if (head) {
    html = html.replace("<title>al4f — Agent Skills infrastructure</title>", "");
    html = html.replace("</head>", `    ${head}\n  </head>`);
  }

  html = html
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
    .replace(/href="\.\//g, `href="${assetPrefix}`)
    .replace(/src="\.\//g, `src="${assetPrefix}`);

  if (depth > 0) {
    html = html.replace(/href="\.\/assets\//g, `href="${assetPrefix}assets/`);
    html = html.replace(/src="\.\/assets\//g, `src="${assetPrefix}assets/`);
  }

  const outPath = path.join(distDir, routeToFilePath(route));
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, html, "utf-8");
  console.log(`  prerendered ${route} → ${routeToFilePath(route)}`);
}

console.log(`\nPrerendered ${routes.length} routes.`);
