#!/usr/bin/env node
/*
 * Build a deployable copy of the theme for YOUR host name.
 *
 *   node tools/build-dist.mjs https://theme.example.org/lcars-homelab/ [dist]
 *
 * Several integrations (Jellyfin, Jenkins, Nextcloud, Guacamole, Keycloak) load
 * fonts and emblems by absolute URL, because the applications inject the CSS in
 * a way that breaks relative paths. In this repository those URLs point to the
 * placeholder https://brand.example.com/lcars-homelab/. This script copies
 * everything that gets served into the output folder (default: dist/), replaces
 * the placeholder with your base URL and rebuilds the Guacamole extension from
 * the rewritten CSS. The repository itself stays unchanged.
 *
 * Then serve the output folder under exactly that base URL (see README).
 */
import { cp, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PLACEHOLDER = "https://brand.example.com/lcars-homelab/";
const TEXT = new Set([".css", ".html", ".json", ".md", ".svg", ".webmanifest", ".properties"]);
const SERVED = ["assets", "css", "errors", "fonts", "integrations", "reference"];

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const [base, outArg = "dist"] = process.argv.slice(2);

if (!base || !/^https?:\/\/[^/]+(\/.*)?$/.test(base)) {
  console.error("usage: node tools/build-dist.mjs <base-url> [output-dir]");
  console.error("example: node tools/build-dist.mjs https://theme.example.org/lcars-homelab/");
  process.exit(2);
}
const baseUrl = base.endsWith("/") ? base : `${base}/`;
const out = resolve(process.cwd(), outArg);
if (out === root) {
  console.error("the output directory must not be the repository itself");
  process.exit(2);
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

await rm(out, { recursive: true, force: true });
for (const part of SERVED) {
  await cp(join(root, part), join(out, part), { recursive: true });
}

let rewritten = 0;
for await (const file of walk(out)) {
  if (!TEXT.has(extname(file))) continue;
  const text = await readFile(file, "utf8");
  if (!text.includes(PLACEHOLDER)) continue;
  await writeFile(file, text.split(PLACEHOLDER).join(baseUrl));
  rewritten += 1;
}

// The Guacamole extension embeds its CSS - rebuild it from the rewritten copy.
const guacamole = join(out, "integrations", "guacamole");
if ((await stat(guacamole).catch(() => null))?.isDirectory()) {
  execFileSync(process.execPath, [join(guacamole, "build-extension.mjs")], { stdio: "inherit" });
}

console.log(`${out}: ${rewritten} files point to ${baseUrl}`);
