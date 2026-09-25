import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderEmblemPng } from "../../assets/favicon/build-icons.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(here, "..", "..", "assets", "emblem--gitea.svg");
const outputDir = process.argv[2] ? resolve(process.argv[2]) : join(here, "assets");

const sourceSvg = await readFile(sourcePath, "utf8");
if (!sourceSvg.includes('viewBox="0 0 100 116"') || !sourceSvg.includes("em-clip-gitea")) {
  throw new Error("emblem--gitea.svg is not the expected Gitea version.");
}

await mkdir(outputDir, { recursive: true });
await Promise.all([
  writeFile(join(outputDir, "logo.svg"), sourceSvg, "utf8"),
  writeFile(join(outputDir, "favicon.svg"), sourceSvg, "utf8"),
  writeFile(join(outputDir, "favicon.png"), renderEmblemPng(32, "gitea")),
  writeFile(join(outputDir, "logo.png"), renderEmblemPng(512, "gitea")),
  writeFile(join(outputDir, "apple-touch-icon.png"), renderEmblemPng(180, "gitea")),
]);
