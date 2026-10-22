import { cp, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const out = join(root, ".vercel-static");

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

for (const name of ["index.html", "styles.css", "favicon.svg", "robots.txt"]) {
  await cp(join(root, name), join(out, name));
}
await cp(join(root, "dist"), join(out, "dist"), { recursive: true });
console.log("Staged MoneyMind static files in .vercel-static");
