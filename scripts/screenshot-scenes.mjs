// Usage: node scripts/screenshot-scenes.mjs <url> <outDir> [width] [height]
// One frame per section at its start, plus mid/end frames for tall (sticky) sections.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const [url = "http://localhost:5173", outDir = "shots", width = "1920", height = "1080"] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: Number(width), height: Number(height) }, deviceScaleFactor: 1 });
page.on("pageerror", (error) => console.log("PAGE ERROR:", error.message));
page.on("console", (message) => {
  if (message.type() === "error") console.log("CONSOLE ERROR:", message.text());
});
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(2500);

const sections = await page.evaluate(() =>
  [...document.querySelectorAll("main > section, main > footer, main section")]
    .filter((node) => node.parentElement?.tagName === "MAIN")
    .map((node) => {
      const rect = node.getBoundingClientRect();
      return { top: Math.round(rect.top + window.scrollY), height: Math.round(rect.height), label: node.getAttribute("aria-label") ?? node.tagName };
    }),
);
console.log("sections:", sections.length);

const viewport = Number(height);
for (const [index, section] of sections.entries()) {
  const travel = section.height - viewport;
  const fractions = travel > viewport * 0.5 ? [0, 0.25, 0.5, 0.7, 0.85, 1] : [0];
  for (const fraction of fractions) {
    const y = section.top + Math.round(Math.max(0, travel) * fraction);
    await page.evaluate((target) => window.scrollTo({ top: target, behavior: "instant" }), y);
    await page.waitForTimeout(950);
    const file = join(outDir, `s${String(index + 1).padStart(2, "0")}-${String(Math.round(fraction * 100)).padStart(3, "0")}.png`);
    await page.screenshot({ path: file });
    console.log("saved", file, "|", section.label);
  }
}
await browser.close();
