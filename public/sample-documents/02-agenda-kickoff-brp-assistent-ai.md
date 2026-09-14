# Agenda Kickoff-meeting — Project BRP-Assistent AI

**Datum:** 8 april 2026, 10:00–12:00
**Locatie:** Hofzaal, MinBZK Den Haag (hybride)
**Voorzitter:** Sanne Dijkstra (productowner)
**Opdrachtgever:** Rijksdienst voor Identiteitsgegevens (RvIG), Directie Dienstverlening
**Aanspreekpunt project:** Anouk de Wit (architect) — anouk.dewit@rvig.nl, 06-21458877

## Doel van de meeting

Formele aftrap van het project BRP-Assistent AI. We willen aan het einde van de bijeenkomst commitment hebben op scope, governance en de eerste mijlpaal (werkende prototype voor interne demo in Q3).

## Deelnemers

- Sanne Dijkstra — productowner (MinBZK/RvIG)
- Mark de Vries — lead data science
- Joost Verburg — juridisch adviseur
- Marieke Jansen — Functionaris voor de Gegevensbescherming (FG)
- Erik Hoekstra — CISO
- Anouk de Wit — architect
- Femke Bakker — UX-lead

## Agenda

### 1. Projectkader en doel (10:00–10:15)
*Sanne* — Korte herhaling van de business case: AI-assistent op MijnOverheid die burgers uitleg op maat geeft bij hun eigen persoonslijst in de BRP.

### 2. Technische architectuur (10:15–10:45)
*Mark & Anouk* — Voorgestelde oplossing: een Retrieval-Augmented Generation (RAG) opzet met een LLM van Azure OpenAI (GPT-4 klasse) en een vectorindex over de Wet BRP, het Logisch Ontwerp BRP en de officiële RvIG-toelichtingen. De persoonslijst van de ingelogde burger wordt via een afgeschermde tool-call opgehaald uit de BRP-verstrekkingsvoorziening.

### 3. Privacy en gegevensverwerking (10:45–11:15)
*Marieke (FG) & Joost* — Doorlopen van de prescan DPIA. Verwerkte gegevens: BSN, NAW, nationaliteit, verblijfstitel, burgerlijke staat, ouder- en kindgegevens en adreshistorie. Bewaartermijn van conversaties wordt voorgesteld op 30 dagen voor kwaliteitsverbetering, daarna anonimisering. Bespreken: rechtsgrond (wettelijke taak), profileringsverbod, de bijzondere gevoeligheid van nationaliteits- en verblijfstitelgegevens, en doorgifte naar Azure (EU-region, DPA).

### 4. Informatiebeveiliging (11:15–11:30)
*Erik (CISO)* — BIO-classificatie van de verwerking, vereisten voor authenticatie (DigiD substantieel), logging en monitoring van prompts en responses, en het beveiligingsregime voor de Azure-omgeving.

### 5. Risico's en mitigaties (11:30–11:50)
*Allen* — Open discussie over hallucinatie-risico, aansprakelijkheid bij foutieve uitleg over de eigen registratie, en de noodzaak van een menselijke fallback (doorverwijzing naar de RvIG-informatielijn of de gemeente).

### 6. Rondvraag en planning (11:50–12:00)
*Sanne* — Vaststellen van de volgende mijlpalen en eigenaarschap per werkstroom.

## Openstaande vragen

- Welke modelleverancier kiezen we definitief (Azure OpenAI vs. een gehost open-source model)?
- Wordt het systeem ingezet als hoog-risico onder de AI-verordening?
- Moeten we een KIA (Kinderrechten Impact Assessment) doen, gezien de ouder- en kindgegevens op de persoonslijst?
