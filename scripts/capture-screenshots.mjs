/**
 * Legt de screenshots in docs/screenshots/ opnieuw vast tegen een draaiende
 * dev-omgeving. Handmatig uit te voeren wanneer de huisstijl of de UI wijzigt.
 *
 * Eenmalig: de Playwright-browser ophalen (staat niet in de npm-install):
 *
 *     npx playwright install chromium
 *
 * Daarna, met beide servers op:
 *
 *     .venv/bin/python backend/main.py --dev      # DEV_AUTH_BYPASS
 *     npm run dev                                 # VITE_AUTH_BYPASS=true
 *     node scripts/capture-screenshots.mjs
 *
 * Verwacht een dossier "BRP-Assistent AI" met de bestanden uit
 * public/sample-documents/ erin, de beslishulp AI-verordening doorlopen en het
 * AI Impact Assessment (deels) ingevuld. BASE overschrijft de dev-URL wanneer
 * Vite een andere poort kiest.
 */
import { chromium } from 'playwright'

const B = process.env.BASE || 'http://localhost:5173'
const OUT = 'docs/screenshots'
const DOSSIER = 'BRP-Assistent AI'
const FORM = 'AI Impact Assessment'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 950 }, deviceScaleFactor: 2 })

const shot = async (name, opts = {}) => {
  await page.waitForTimeout(900)
  await page.screenshot({ path: `${OUT}/${name}.png`, ...opts })
  console.log('  ✓', name + '.png')
}
const portal = async () => {
  await page.goto(B + '/#/dossiers', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1600)
  const back = page.getByText('‹ Alle dossiers').first()
  if (await back.isVisible().catch(() => false)) { await back.click(); await page.waitForTimeout(1500) }
}
const openDossier = async () => {
  await portal()
  await page.getByText(DOSSIER, { exact: true }).first().click()
  await page.waitForTimeout(2600)
}
const openForm = async () => {
  await openDossier()
  const card = page.locator('.form-card')
    .filter({ has: page.locator('.form-card__title', { hasText: FORM }) }).first()
  await card.scrollIntoViewIfNeeded()
  await card.locator('.form-card__btn').first().click({ force: true })
  await page.waitForTimeout(2600)
}

// 1 — dossieroverzicht
await portal()
await shot('portal')

// 2 — dossier met brondocumenten en formulieroverzicht. Het overzicht telt 20
// kaarten; een volledige paginaschermafdruk wordt daarmee ~12.000px hoog, dus
// knippen we bij tot de documenten plus het begin van het overzicht.
await openDossier()
await shot('portal-docs', { fullPage: true, clip: { x: 0, y: 0, width: 1440, height: 2100 } })

// 3 — introductiepagina van een formulier
await openForm()
await shot('form-intro', { fullPage: true })

// 4 — risicoclassificatie via de beslishulp AI-verordening
await page.getByText('Risicoclassificatie', { exact: true }).first().click()
await page.waitForTimeout(1400)
await page.getByText(/Beslishulp AI-verordening doorlopen|Beslishulp bekijken of herzien/).first()
  .click({ force: true })
await page.waitForTimeout(2200)
const dlg = page.locator('dialog[open]').first()
// bij een reeds doorlopen beslishulp opent de modal op de conclusie
const restart = dlg.locator('nldd-button[text="Opnieuw beginnen"]').first()
if (await restart.isVisible().catch(() => false)) { await restart.click({ force: true }); await page.waitForTimeout(1600) }
await shot('risk-classification')
await dlg.locator('nldd-button[text="Sluiten"], button[aria-label="Sluiten"]').first()
  .click({ force: true }).catch(() => {})
await page.waitForTimeout(1200)

// 5 — vragen met sectienavigatie
await openForm()
for (const section of ['1.2 Beoogde oplossing', '1.1 Doel van het systeem']) {
  const link = page.locator('.invulhulp-nav__link').filter({ hasText: section }).first()
  if (await link.count()) { await link.click(); break }
}
await page.waitForTimeout(2000)
await shot('form-questions')

// 6 — samenvatting en export
const sum = page.locator('.invulhulp-nav__link').filter({ hasText: 'Samenvatting & export' }).first()
await sum.scrollIntoViewIfNeeded()
await sum.click()
await page.waitForTimeout(2600)
await shot('summary')

await browser.close()
console.log('klaar')
