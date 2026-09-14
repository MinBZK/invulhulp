# Notulen Architectuuroverleg — BRP-Assistent AI

**Datum:** 22 april 2026
**Aanwezig:** Anouk (architect), Mark (data science), Erik (CISO), Tom (DevOps), Marieke (FG)
**Notulist:** Tom

## Beslissingen

### Modelleverancier
Gekozen voor **Azure OpenAI Service** (deployment in regio West-Europa). Reden: bestaande raamovereenkomst, EU-data-residency, en SOC2/ISO27001-compliance van de leverancier. Het concreet ingezette model is `gpt-4.1` met fallback naar `gpt-4o-mini` voor goedkopere routes (veelgestelde vragen).

### Gegevensverwerking
De volgende persoonsgegevens worden verwerkt per sessie:
- **BSN** (uitsluitend intern voor het ophalen van de persoonslijst — wordt nooit naar het LLM gestuurd)
- **NAW-gegevens** (niet naar LLM)
- **Nationaliteit, verblijfstitel, burgerlijke staat, ouder- en kindgegevens, adreshistorie** (worden geabstraheerd doorgegeven aan het LLM zonder direct identificeerbare velden)
- **Conversatiehistorie** van de huidige sessie (in-memory)

### Bewaartermijn
- Conversaties: **30 dagen** in versleutelde vorm voor kwaliteitsverbetering en debugging, daarna automatische verwijdering.
- Geanonimiseerde geaggregeerde statistieken: **3 jaar** voor productverbetering.

### Integraties
- **MijnOverheid-frontend** voor de chat-widget (REST-koppeling via bestaande API-gateway).
- **BRP-verstrekkingsvoorziening** voor het real-time ophalen van de persoonslijst van de ingelogde burger (read-only).
- **Azure Key Vault** voor API-keys.
- **ELK-stack** voor logging (prompts en responses gepseudonimiseerd).

## Geïdentificeerde risico's

| # | Risico | Impact | Waarschijnlijkheid | Mitigatie |
|---|---|---|---|---|
| 1 | Hallucinatie van het LLM (onjuiste uitleg over nationaliteit of verblijfstitel) | Hoog | Middel | RAG met strikte grounding op Wet BRP en Logisch Ontwerp, disclaimer in elk antwoord, doorverwijzing naar de RvIG-informatielijn |
| 2 | Prompt-injectie via gebruikersinvoer | Middel | Middel | Input-sanitisatie, structured prompting, geen tool-execution op basis van gebruikersinvoer |
| 3 | Datalek via logs | Hoog | Laag | Pseudonimisering van BSN/NAW vóór logging, beperkte toegang tot ELK |
| 4 | Bias in antwoorden ten nadele van specifieke groepen (met name bij nationaliteits- en verblijfstitelvragen) | Middel | Onbekend | Periodieke fairness-audit, klachtenmechanisme in de UI |
| 5 | Onbeschikbaarheid Azure OpenAI | Laag | Laag | Graceful degradation naar statische toelichtingen op rvig.nl |

## Open punten

- Marieke vraagt of de pseudonimisering technisch ook werkt voor vrije invoer van burgers (bijv. wanneer ze hun eigen naam typen in de chat).
- Erik wil een pentest plannen vóór ingebruikname.
- Anouk gaat een C4-diagram opstellen voor de PSA.
