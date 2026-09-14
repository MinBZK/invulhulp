/**
 * Genereert public/sample-documents/07-verwerkingsregister-brp-assistent-ai.pdf.
 *
 * Voorbeelddocument voor de demo: een verwerkingsregister bij de fictieve
 * BRP-Assistent AI van RvIG. Het document is bedoeld als bronbestand om te
 * uploaden, zodat de RAG-extractie iets realistisch te pakken heeft.
 *
 * De twee figuren worden als vectortekening opgebouwd (niet als afbeelding),
 * zodat ook de labels in de diagrammen door de tekstextractie worden gevonden.
 *
 *   node scripts/generate-verwerkingsregister.mjs
 */
import PDFDocument from 'pdfkit'
import fs from 'node:fs'
import path from 'node:path'

const OUT = path.join('public', 'sample-documents', '07-verwerkingsregister-brp-assistent-ai.pdf')

const INK = '#1f2d3d', MUTED = '#5b6b7c', LINE = '#c8d2dc'
const RED = '#a4243b', REDBG = '#f7e8ea', GREEN = '#2f5d50', GREENBG = '#e7efeb'
const BOXBG = '#eef2f6', ZONE = '#f4f8f9', ZONE2 = '#eef4ef'

const M = 56
const doc = new PDFDocument({ size: 'A4', margins: { top: M, bottom: M, left: M, right: M }, info: {
  Title: 'Verwerkingsregister BRP-Assistent AI',
  Author: 'Marieke Vos (functionaris gegevensbescherming), RvIG',
  Subject: 'Register van verwerkingen (AVG art. 30) bij de BRP-Assistent AI',
} })
doc.pipe(fs.createWriteStream(OUT))
const W = doc.page.width - M * 2

const reset = () => { doc.x = M; return doc }
const h1 = (t) => reset().font('Helvetica-Bold').fontSize(17).fillColor(INK).text(t, { width: W }).moveDown(0.4)
const h2 = (t) => { space(22); reset().font('Helvetica-Bold').fontSize(11.5).fillColor(INK).text(t, { width: W }).moveDown(0.35) }
const p = (t, o = {}) => reset().font('Helvetica').fontSize(9.5).fillColor(INK)
  .text(t, { width: W, align: 'justify', lineGap: 1.5, ...o }).moveDown(0.5)
const caption = (t) => reset().font('Helvetica-Oblique').fontSize(8).fillColor(MUTED)
  .text(t, { width: W, lineGap: 1 }).moveDown(0.6)
const space = (need) => { if (doc.y + need > doc.page.height - M) doc.addPage() }

/** Tabel met vaste kolombreedtes; wikkelt cellen en breekt netjes over pagina's. */
function table(cols, rows, { head = true, size = 8.2 } = {}) {
  const widths = cols.map((c) => (c.w / cols.reduce((s, x) => s + x.w, 0)) * W)
  const pad = 5
  const rowHeight = (cells, font) => Math.max(...cells.map((v, i) => {
    doc.font(font).fontSize(size)
    return doc.heightOfString(String(v ?? ''), { width: widths[i] - pad * 2, lineGap: 0.5 })
  })) + pad * 2
  const draw = (cells, font, fill) => {
    const h = rowHeight(cells, font)
    space(h + 4)
    const y = doc.y
    if (fill) doc.rect(M, y, W, h).fill(fill)
    let x = M
    cells.forEach((v, i) => {
      doc.font(font).fontSize(size).fillColor(INK)
        .text(String(v ?? ''), x + pad, y + pad, { width: widths[i] - pad * 2, lineGap: 0.5 })
      x += widths[i]
    })
    doc.moveTo(M, y + h).lineTo(M + W, y + h).lineWidth(0.5).strokeColor(LINE).stroke()
    doc.y = y + h
  }
  if (head) draw(cols.map((c) => c.t), 'Helvetica-Bold', BOXBG)
  rows.forEach((r) => draw(r, 'Helvetica'))
  doc.x = M
  doc.moveDown(0.7)
}

/** Afgeronde doos met vette kop + optionele regels eronder. */
function node(x, y, w, h, title, lines, { bg = '#ffffff', border = INK, color = INK, radius = 5 } = {}) {
  doc.roundedRect(x, y, w, h, radius).fillAndStroke(bg, border)
  doc.lineWidth(0.9)
  const all = [{ t: title, f: 'Helvetica-Bold', s: 8.4 }, ...(lines || []).map((l) => ({ t: l, f: 'Helvetica', s: 7.4 }))]
  const th = all.reduce((s, l) => { doc.font(l.f).fontSize(l.s); return s + doc.heightOfString(l.t, { width: w - 8 }) }, 0)
  let ty = y + (h - th) / 2
  all.forEach((l) => {
    doc.font(l.f).fontSize(l.s).fillColor(color).text(l.t, x + 4, ty, { width: w - 8, align: 'center' })
    ty += doc.heightOfString(l.t, { width: w - 8 })
  })
}

function arrow(x1, y1, x2, y2, { color = INK, dash = false } = {}) {
  doc.save().lineWidth(1.1).strokeColor(color)
  if (dash) doc.dash(3, { space: 2 })
  doc.moveTo(x1, y1).lineTo(x2, y2).stroke()
  doc.undash()
  const a = Math.atan2(y2 - y1, x2 - x1), s = 4.5
  doc.moveTo(x2, y2)
    .lineTo(x2 - s * Math.cos(a - 0.5), y2 - s * Math.sin(a - 0.5))
    .lineTo(x2 - s * Math.cos(a + 0.5), y2 - s * Math.sin(a + 0.5))
    .closePath().fill(color)
  doc.restore()
}
const label = (t, x, y, w, { size = 6.8, color = MUTED, align = 'center', bold = false } = {}) =>
  doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(size).fillColor(color)
    .text(t, x, y, { width: w, align })

// ─────────────────────────── Titelblok ───────────────────────────
h1('Verwerkingsregister BRP-Assistent AI')
doc.font('Helvetica').fontSize(9).fillColor(MUTED)
;[
  'Organisatie: Rijksdienst voor Identiteitsgegevens (RvIG), team Digitale Dienstverlening',
  'Versie: 1.2 — vastgesteld 12 mei 2026',
  'Opgesteld door: Marieke Vos (functionaris gegevensbescherming)',
  'Contactpersoon: Anouk de Wit, IT-architect — anouk.dewit@rvig.nl',
  'Status: concept ter besluitvorming, bijlage bij de DPIA',
].forEach((l) => doc.text(l, { width: W }))
doc.moveDown(0.8)
doc.moveTo(M, doc.y).lineTo(M + W, doc.y).lineWidth(0.8).strokeColor(LINE).stroke()
doc.moveDown(0.8)

p('Dit register beschrijft de verwerkingen van persoonsgegevens binnen de AI-assistent BRP-Assistent AI, die burgers in begrijpelijke taal uitleg geeft bij de gegevens op hun eigen persoonslijst in de Basisregistratie Personen (BRP). Het register is een bijlage bij de DPIA en volgt de besluiten uit het architectuuroverleg van 22 april 2026.')

h2('1. Verwerkingen en grondslagen')
p('De assistent kent drie onderscheiden verwerkingen. De grondslag voor de primaire verwerking is de uitvoering van een taak van algemeen belang (artikel 6 lid 1 sub e AVG), namelijk de wettelijke taak van RvIG om burgers inzage te geven in hun eigen gegevens en hen daarover begrijpelijk te informeren.')
table(
  [{ t: 'Nr.', w: 7 }, { t: 'Verwerking', w: 22 }, { t: 'Doeleinde', w: 27 }, { t: 'Grondslag (AVG)', w: 22 }, { t: 'Categorie betrokkenen', w: 22 }],
  [
    ['V1', 'Uitleg bij gegevens op de persoonslijst', 'Burger begrijpelijke toelichting geven op de eigen persoonslijst', 'Art. 6 lid 1 sub e — taak van algemeen belang', 'Ingezetenen met een registratie in de BRP'],
    ['V2', 'Kwaliteitsverbetering en debugging', 'Foutieve of onvolledige antwoorden opsporen en corrigeren', 'Art. 6 lid 1 sub e — taak van algemeen belang', 'Burgers die de assistent hebben gebruikt'],
    ['V3', 'Geaggregeerde productstatistieken', 'Gebruik en effectiviteit meten voor doorontwikkeling', 'Geen — gegevens zijn geanonimiseerd', 'Niet van toepassing'],
  ],
)

h2('2. Systeemarchitectuur')
p('De assistent draait in het eigen datacenter in Den Haag; uitsluitend de promptservice communiceert met het taalmodel bij Azure. Het BSN en de NAW-gegevens verlaten het eigen datacenter niet: de orchestrator abstraheert de persoonslijstgegevens voordat een prompt de zonegrens passeert.')

// ─────────────────────── Figuur 1: systeemarchitectuur ───────────────────────
function figureArchitecture() {
  const figH = 232
  space(figH + 40)
  const y0 = doc.y + 4
  const aw = W * 0.71, gap = W * 0.03, xB = M + aw + gap, bw = W - aw - gap

  doc.save().lineWidth(0.9).dash(4, { space: 3 })
  doc.roundedRect(M, y0, aw, figH, 6).fillAndStroke(ZONE, LINE)
  doc.roundedRect(xB, y0, bw, figH, 6).fillAndStroke(ZONE2, '#b9ccbf')
  doc.undash().restore()

  label('Eigen datacenter Den Haag', M + 12, y0 + 9, aw - 24, { size: 8.6, color: INK, align: 'left', bold: true })
  label('Microsoft Azure', xB + 10, y0 + 9, bw - 20, { size: 8.6, color: GREEN, align: 'left', bold: true })
  label('regio West-Europa (EER)', xB + 10, y0 + 20, bw - 20, { size: 7, color: GREEN, align: 'left' })

  const burger = [M + 14, y0 + 34, 96, 34]
  const widget = [M + 14, y0 + 92, 96, 38]
  const gatew  = [M + 124, y0 + 92, 76, 38]
  const orch   = [M + 206, y0 + 84, 92, 54]
  const guard  = [M + 206, y0 + 24, 92, 42]
  const elk    = [M + 14, y0 + 170, 96, 36]
  const brp    = [M + 124, y0 + 170, 118, 36]
  const aoai   = [xB + 12, y0 + 84, bw - 24, 50]
  const vault  = [xB + 12, y0 + 170, bw - 24, 36]

  node(...burger, 'Burger', ['DigiD-authenticatie'])
  node(...widget, 'Chat-widget', ['MijnOverheid'])
  node(...gatew, 'API-gateway', ['TLS 1.3'])
  node(...orch, 'Orchestrator', ['promptservice', 'abstraheren en pseudonimiseren'], { bg: BOXBG })
  node(...guard, 'BSN en NAW', ['blijven binnen het', 'eigen datacenter'], { bg: REDBG, border: RED, color: RED })
  node(...elk, 'ELK-stack', ['gepseudonimiseerd'])
  node(...brp, 'BRP-verstrekkingsvoorziening', ['read-only koppeling'])
  node(...aoai, 'Azure OpenAI Service', ['gpt-4.1 (primair)', 'gpt-4o-mini (FAQ-route)'], { border: GREEN })
  node(...vault, 'Azure Key Vault', ['sleutelmateriaal'], { border: GREEN })

  arrow(burger[0] + 48, burger[1] + burger[3], widget[0] + 48, widget[1])
  arrow(widget[0] + widget[2], widget[1] + 19, gatew[0], gatew[1] + 19)
  arrow(gatew[0] + gatew[2], gatew[1] + 19, orch[0], orch[1] + 27)
  arrow(guard[0] + 46, guard[1] + guard[3], orch[0] + 46, orch[1], { color: RED })
  arrow(orch[0] + orch[2], orch[1] + 27, aoai[0], aoai[1] + 25, { color: GREEN })
  label('geabstraheerd', orch[0] + orch[2], orch[1] + 4, aoai[0] - orch[0] - orch[2], { size: 6.4 })
  label('+ conversatie', orch[0] + orch[2], orch[1] + 12, aoai[0] - orch[0] - orch[2], { size: 6.4 })

  // zonegrens die BSN/NAW niet passeert
  doc.save().lineWidth(1).strokeColor(RED).dash(3, { space: 2 })
    .moveTo(guard[0] + guard[2], guard[1] + 21).lineTo(M + aw - 26, guard[1] + 21).stroke().undash()
  const cx = M + aw - 16, cy = guard[1] + 21
  doc.lineWidth(1.4).moveTo(cx - 5, cy - 5).lineTo(cx + 5, cy + 5)
    .moveTo(cx + 5, cy - 5).lineTo(cx - 5, cy + 5).stroke().restore()

  // orchestrator omlaag naar BRP-koppeling en ELK
  doc.save().lineWidth(1.1).strokeColor(INK)
    .moveTo(orch[0] + 30, orch[1] + orch[3]).lineTo(orch[0] + 30, brp[1] + 18).stroke()
    .moveTo(orch[0] + 66, orch[1] + orch[3]).lineTo(orch[0] + 66, elk[1] + 48)
    .lineTo(elk[0] + 48, elk[1] + 48).stroke().restore()
  arrow(orch[0] + 30, brp[1] + 18, brp[0] + brp[2], brp[1] + 18)
  arrow(elk[0] + 48, elk[1] + 48, elk[0] + 48, elk[1] + elk[3])
  arrow(orch[0] + orch[2], vault[1] + 18, vault[0], vault[1] + 18, { color: GREEN })
  doc.save().lineWidth(1.1).strokeColor(GREEN)
    .moveTo(orch[0] + orch[2] - 10, orch[1] + orch[3]).lineTo(orch[0] + orch[2] - 10, vault[1] + 18)
    .lineTo(orch[0] + orch[2], vault[1] + 18).stroke().restore()

  doc.y = y0 + figH + 8
  doc.x = M
  caption('Figuur 1 — Systeemarchitectuur BRP-Assistent AI, met de zonegrens tussen het eigen datacenter in Den Haag en Azure West-Europa. BSN en NAW-gegevens passeren deze grens niet.')
}
figureArchitecture()

h2('3. Categorieën persoonsgegevens')
p('Onderstaande tabel geeft per categorie betrokkene aan welke persoonsgegevens worden verwerkt, van welk type deze zijn en uit welke bron zij afkomstig zijn. De kolom Naar LLM geeft aan of het gegeven het taalmodel bereikt; dit is bepalend voor de risicobeoordeling.')
table(
  [{ t: 'Categorie betrokkenen', w: 11 }, { t: 'Categorie persoonsgegevens', w: 18 }, { t: 'Persoonsgegevens', w: 22 }, { t: 'Type persoonsgegeven', w: 20 }, { t: 'Bron', w: 16 }, { t: 'Naar LLM', w: 15 }],
  [
    ['Burger', 'Identificerende gegevens', 'BSN', 'Identificatienummer', 'DigiD-authenticatie', 'Nee'],
    ['Burger', 'NAW-gegevens', 'Naam, adres, woonplaats', 'Gewoon', 'BRP-persoonslijst', 'Nee'],
    ['Burger', 'Nationaliteit en verblijfsrecht', 'Nationaliteit, verblijfstitel en aantekeningen daarbij', 'Gewoon, verhoogd gevoelig', 'BRP-verstrekkings-voorziening (read-only)', 'Ja, geabstraheerd'],
    ['Burger', 'Burgerlijke staat en familierechtelijke betrekkingen', 'Burgerlijke staat, ouder- en kindgegevens, adreshistorie', 'Gewoon', 'BRP-verstrekkings-voorziening (read-only)', 'Ja, geabstraheerd'],
    ['Burger', 'Conversatiegegevens', 'Vrije tekst die de burger in de chat invoert', 'Gewoon', 'Direct van de betrokkene', 'Ja, gefilterd'],
  ],
)

p('Het BSN wordt uitsluitend intern gebruikt voor het ophalen van de persoonslijst en wordt nooit naar het taalmodel gestuurd. Gegevens over nationaliteit, verblijfstitel en familierechtelijke betrekkingen worden geabstraheerd doorgegeven, zonder direct identificeerbare velden.')
p('Onderstaand schema toont per gegevenssoort welke bewerking in het eigen datacenter plaatsvindt en of het gegeven het taalmodel daadwerkelijk bereikt.')

// ───────────────────── Figuur 2: gegevensstroom per veld ─────────────────────
function figureDataFlow() {
  const rows = [
    { bron: 'BSN', sub: ['DigiD-authenticatie'], op: ['uitsluitend gebruikt om de', 'persoonslijst op te halen'], ok: false, uit: 'Nee — geblokkeerd', uitSub: null },
    { bron: 'NAW-gegevens', sub: ['BRP-persoonslijst'], op: ['alleen voor weergave in de', 'widget aan de burger zelf'], ok: false, uit: 'Nee — geblokkeerd', uitSub: null },
    { bron: 'BRP-gegevens', sub: ['nationaliteit, verblijfstitel,', 'adreshistorie'], op: ['geabstraheerd tot categorieën', 'en codes, zonder', 'identificerende velden'], ok: true, uit: 'Ja — geabstraheerd', uitSub: 'Azure OpenAI, West-Europa' },
    { bron: 'Conversatietekst', sub: ['direct van de betrokkene', 'via de chat-widget'], op: ['gefilterd op direct', 'identificeerbare gegevens,', 'daarna gepseudonimiseerd'], ok: true, uit: 'Ja — gefilterd', uitSub: 'Azure OpenAI, West-Europa' },
  ]
  const rh = 44, rgap = 9, headH = 24
  const figH = headH + rows.length * (rh + rgap) + 30
  space(figH + 30)
  const y0 = doc.y + 4
  const c1 = M, w1 = 122
  const c2 = M + 160, w2 = 176
  const c3 = M + 358, w3 = W - 358

  label('Bron', c1, y0, w1, { size: 8.4, color: INK, bold: true })
  label('Bewerking in eigen datacenter', c2, y0, w2, { size: 8.4, color: INK, bold: true })
  label('Bereikt het taalmodel', c3, y0, w3, { size: 8.4, color: INK, bold: true })
  doc.moveTo(M, y0 + 14).lineTo(M + W, y0 + 14).lineWidth(0.8).strokeColor('#8c9bab').stroke()

  rows.forEach((r, i) => {
    const y = y0 + headH + i * (rh + rgap)
    node(c1, y, w1, rh, r.bron, r.sub)
    node(c2, y, w2, rh, r.op[0], r.op.slice(1), {
      bg: r.ok ? GREENBG : REDBG, border: r.ok ? GREEN : RED, color: r.ok ? GREEN : RED,
    })
    arrow(c1 + w1, y + rh / 2, c2 - 2, y + rh / 2)
    if (r.ok) arrow(c2 + w2, y + rh / 2, c3 - 2, y + rh / 2)
    const ty = r.uitSub ? y + rh / 2 - 11 : y + rh / 2 - 5
    label(r.uit, c3, ty, w3, { size: 8.6, color: r.ok ? GREEN : RED, bold: true })
    if (r.uitSub) label(r.uitSub, c3, ty + 12, w3, { size: 7.2, color: MUTED })
  })

  // zonegrenzen
  const yTop = y0 + headH - 6, yBot = y0 + headH + rows.length * (rh + rgap) - 2
  doc.save().lineWidth(0.9).strokeColor(LINE).dash(3, { space: 3 })
  doc.moveTo(c2 - 19, yTop).lineTo(c2 - 19, yBot).stroke()
  doc.moveTo(c3 - 19, yTop).lineTo(c3 - 19, yBot).stroke()
  doc.undash().restore()
  doc.moveTo(M, yBot + 8).lineTo(M + W, yBot + 8).lineWidth(0.8).strokeColor('#8c9bab').stroke()

  doc.y = yBot + 16
  doc.x = M
  doc.font('Helvetica').fontSize(7.6).fillColor(INK).text(
    'Bewaartermijn conversatiehistorie: 30 dagen, versleuteld (AES-256). Applicatielogging: 90 dagen, gepseudonimiseerd.\nPersoonslijstgegevens worden niet opgeslagen en bestaan uitsluitend in-memory tijdens de sessie.',
    M, doc.y, { width: W, lineGap: 1.5 })
  doc.moveDown(0.6)
  caption('Figuur 2 — Gegevensstroom per veld: welke bewerking in het eigen datacenter plaatsvindt en welke gegevens het taalmodel bereiken.')
}
figureDataFlow()

h2('4. Bewaartermijnen')
table(
  [{ t: 'Gegevenssoort', w: 24 }, { t: 'Bewaartermijn', w: 15 }, { t: 'Ingang van de termijn', w: 19 }, { t: 'Wijze van verwijdering', w: 22 }, { t: 'Verantwoordelijke', w: 20 }],
  [
    ['Conversatiehistorie (versleuteld)', '30 dagen', 'Afsluiten van de sessie', 'Automatisch, geplande taak', 'Team Digitale Dienstverlening'],
    ['Geanonimiseerde statistieken', '3 jaar', 'Einde kalenderjaar', 'Handmatig na jaarlijkse review', 'Productowner'],
    ['Applicatielogging (gepseudonimiseerd)', '90 dagen', 'Moment van vastlegging', 'Automatisch, retentiebeleid ELK', 'Team DevOps'],
    ['Auditlog beheerhandelingen', '7 jaar', 'Moment van vastlegging', 'Automatisch, retentiebeleid ELK', 'CISO'],
    ['Persoonslijstgegevens', 'Niet opgeslagen', 'Niet van toepassing', 'Alleen in-memory tijdens de sessie', 'Team Digitale Dienstverlening'],
  ],
)

h2('5. Ontvangers en verwerkers')
p('De assistent maakt gebruik van Azure OpenAI Service met een deployment in de regio West-Europa. Er vindt geen doorgifte van persoonsgegevens buiten de Europese Economische Ruimte plaats. Met alle verwerkers is een verwerkersovereenkomst gesloten.')
table(
  [{ t: 'Ontvanger', w: 19 }, { t: 'Rol', w: 14 }, { t: 'Verstrekte gegevens', w: 23 }, { t: 'Locatie verwerking', w: 19 }, { t: 'Verwerkersovereenkomst', w: 22 }],
  [
    ['Microsoft Azure OpenAI Service', 'Verwerker', 'Geabstraheerde BRP-gegevens, conversatietekst', 'West-Europa (Nederland/Ierland)', 'Ja, d.d. 3 maart 2026'],
    ['Azure Key Vault', 'Verwerker', 'Geen persoonsgegevens, uitsluitend sleutelmateriaal', 'West-Europa', 'Ja, onderdeel raamovereenkomst'],
    ['Interne ELK-stack', 'Eigen infrastructuur', 'Gepseudonimiseerde prompts en responses', 'Eigen datacenter Den Haag', 'Niet van toepassing'],
    ['RvIG-informatielijn (tweedelijns)', 'Interne ontvanger', 'Conversatiesamenvatting bij doorverwijzing', 'Eigen datacenter Den Haag', 'Niet van toepassing'],
  ],
)

h2('6. Ingezette modellen')
table(
  [{ t: 'Model', w: 14 }, { t: 'Toepassing', w: 30 }, { t: 'Leverancier', w: 22 }, { t: 'Regio', w: 14 }, { t: 'Menselijke tussenkomst', w: 20 }],
  [
    ['gpt-4.1', 'Primaire uitlegroute', 'Microsoft Azure OpenAI', 'West-Europa', 'Steekproefsgewijze review'],
    ['gpt-4o-mini', 'Goedkope route voor veelgestelde vragen', 'Microsoft Azure OpenAI', 'West-Europa', 'Steekproefsgewijze review'],
  ],
)

h2('7. Beveiligingsmaatregelen')
p('De maatregelen zijn afgeleid van de Baseline Informatiebeveiliging Overheid (BIO) en zijn vastgesteld door de CISO op 22 april 2026.')
;[
  'Versleuteling van conversatiehistorie in rust (AES-256) en tijdens transport (TLS 1.3).',
  'Pseudonimisering van prompts en responses voordat deze de logging bereiken.',
  'Toegang tot conversatiehistorie uitsluitend voor geautoriseerde beheerders, vastgelegd in een auditlog.',
  'Sleutelbeheer via Azure Key Vault; geen sleutels in broncode of configuratiebestanden.',
  'Filtering van uitgaande antwoorden op direct identificeerbare gegevens vóór weergave aan de burger.',
  'Jaarlijkse penetratietest op de chat-widget en de API-gateway.',
].forEach((t) => { space(16); doc.font('Helvetica').fontSize(9.5).fillColor(INK).text('•  ' + t, M + 4, doc.y, { width: W - 4, lineGap: 1.5 }).moveDown(0.2) })
doc.moveDown(0.4)

space(200) // sectie 8 in haar geheel bij elkaar houden
h2('8. Openstaande punten')
p('De volgende punten zijn nog niet afgerond en worden voorgelegd aan de stuurgroep van 2 juni 2026.')
table(
  [{ t: 'Nr.', w: 7 }, { t: 'Openstaand punt', w: 55 }, { t: 'Eigenaar', w: 20 }, { t: 'Streefdatum', w: 18 }],
  [
    ['P1', 'Vaststellen van de procedure voor het afhandelen van inzage- en correctieverzoeken op conversatiehistorie (AVG art. 15 en 16)', 'Marieke Vos (FG)', '1 juni 2026'],
    ['P2', 'Toetsen of de pseudonimisering ook sluitend werkt voor vrije tekst waarin de burger zelf namen of adressen typt', 'Mark de Vries (data science)', '15 juni 2026'],
    ['P3', 'Besluit over de classificatie van het systeem onder de AI-verordening, mede gelet op de verwerking van nationaliteits- en verblijfstitelgegevens', 'Joost Verburg (juridisch)', '1 juli 2026'],
    ['P4', 'Afronden van de fairness-audit op antwoorden over nationaliteit en verblijfsrecht', 'Femke Bakker (UX)', '1 september 2026'],
  ],
)

doc.end()
