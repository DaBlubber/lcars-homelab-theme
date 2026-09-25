import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createIco, renderEmblemPng } from "../../assets/favicon/build-icons.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const imageDirectory = join(here, "lcars-homelab", "login", "resources", "img");
const outputPath = process.argv[2]
  ? resolve(process.cwd(), process.argv[2])
  : join(imageDirectory, "favicon.ico");
const source = await readFile(join(imageDirectory, "emblem.svg"), "utf8");
if (!source.includes('viewBox="0 0 100 116"') || !source.includes("em-clip-keycloak")) {
  throw new Error("emblem.svg is not the expected Keycloak version.");
}

const sizes = [16, 32, 48];
const images = sizes.map((size) => ({ size, data: renderEmblemPng(size, "keycloak") }));
await mkdir(imageDirectory, { recursive: true });
await writeFile(outputPath, createIco(images));
