// Usage: node scripts/walk-presenter.mjs <url> <outDir> [width] [height] [maxPresses]
// Presses ArrowRight repeatedly (presenter "next") and logs where each press lands; screenshots every stop.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const [url = "http://localhost:5173", outDir = "walk", width = "1920", height = "1080", maxPresses = "80"] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: Number(width), height: Number(height) }, deviceScaleFactor: 1 });
page.on("pageerror", (error) => console.log("PAGE ERROR:", error.message));
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
await page.mouse.click(5, Number(height) / 2);

let last = "";
let idle = 0;
for (let press = 0; press < Number(maxPresses); press += 1) {
  await page.keyboard.press("ArrowRight");
  // Wait until the glide settles (scrollY stable for 300 ms), max 9 s.
  let stable = 0;
  let prev = -1;
  for (let i = 0; i < 60 && stable < 3; i += 1) {
    await page.waitForTimeout(150);
    const y = await page.evaluate(() => window.scrollY);
    stable = y === prev ? stable + 1 : 0;
    prev = y;
  }
  const info = await page.evaluate(() => {
    const counter = document.querySelector("[data-scene]");
    const step = document.querySelector("main > section[data-presenter-step]:not([data-presenter-step='0'])");
    return { y: Math.round(window.scrollY), scene: counter?.textContent, step: step?.dataset.presenterStep ?? "-" };
  });
  const file = join(outDir, `p${String(press + 1).padStart(2, "0")}-${info.scene?.replace(/\s|\//g, "") ?? ""}.png`);
  await page.screenshot({ path: file });
  console.log(`press ${press + 1}: y=${info.y} scene=${info.scene} step=${info.step}`);
  const key = `${info.y}|${info.step}`;
  idle = key === last ? idle + 1 : 0;
  if (idle >= 1 && press > 3) {
    console.log("end of page");
    break;
  }
  last = key;
}
await browser.close();
