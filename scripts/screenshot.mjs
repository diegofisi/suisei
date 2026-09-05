// Usage: node scripts/screenshot.mjs <url> <outDir> [width] [height]
// Scrolls through the page and captures one frame per stop so scroll-driven scenes can be checked.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const [url = "http://localhost:5173", outDir = "shots", width = "1920", height = "1080"] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });

// Uses the installed Google Chrome so no Playwright browser download is needed.
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: Number(width), height: Number(height) }, deviceScaleFactor: 1 });
page.on("pageerror", (error) => console.log("PAGE ERROR:", error.message));
page.on("console", (message) => {
  if (message.type() === "error") console.log("CONSOLE ERROR:", message.text());
});
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(2600);

const total = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
console.log("scrollable px:", total);
const stops = [0, 0.04, 0.08, 0.12, 0.16, 0.2, 0.26, 0.32, 0.38, 0.44, 0.5, 0.58, 0.66, 0.74, 0.82, 0.9, 1];
for (const stop of stops) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), Math.round(total * stop));
  await page.waitForTimeout(900);
  const file = join(outDir, `p${String(Math.round(stop * 100)).padStart(3, "0")}.png`);
  await page.screenshot({ path: file });
  console.log("saved", file);
}
await browser.close();
