import { chromium } from "playwright";
const out = "C:/Users/USER/AppData/Local/Temp/claude/c--Users-USER-Desktop-Suisei/7cbc2cb0-6997-4693-a777-43f4b14f786a/scratchpad/orig3";
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
await page.waitForTimeout(1800);
for (const label of ["Los inicios, 2018", "Actualidad, 2026", "El rechazo y la terquedad"]) {
  const info = await page.evaluate((l) => { const s = document.querySelector(`section[aria-label="${l}"]`); const r = s.getBoundingClientRect(); return { top: Math.round(r.top + window.scrollY), ratio: +(r.height / window.innerHeight).toFixed(2) }; }, label);
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), info.top);
  await page.waitForTimeout(2000);
  console.log(label, info);
  await page.screenshot({ path: `${out}-${label.slice(0, 8).replace(/\W/g, "")}.png` });
}
await browser.close();
