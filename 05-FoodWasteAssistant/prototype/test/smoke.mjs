import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const htmlPath = join(root, "dist", "index.html");
if (!existsSync(htmlPath)) {
  console.error("Missing dist/index.html. Run npm run build first.");
  process.exit(1);
}
const html = readFileSync(htmlPath, "utf8");
if (!html.includes("FreshLoop")) {
  console.error("Built page does not mention FreshLoop.");
  process.exit(1);
}
const asset = html.match(/assets\/index-[^"]+\.js/);
if (!asset || !existsSync(join(root, "dist", asset[0]))) {
  console.error("Built script is missing.");
  process.exit(1);
}
console.log("smoke ok");
