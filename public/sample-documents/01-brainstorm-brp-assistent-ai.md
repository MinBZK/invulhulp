# Brainstormnotitie — BRP-Assistent AI

**Datum:** 14 maart 2026
**Aanwezig:** Sanne (productowner), Mark (data science), Joost (juridisch), Femke (UX)
**Notulist:** Femke

## Opdrachtgever en contactgegevens

- **Opdrachtgever:** Rijksdienst voor Identiteitsgegevens (RvIG)
- **Directie / afdeling:** Directie Dienstverlening, team Digitale Dienstverlening
- **Contactpersoon (aanspreekpunt voor dit verzoek):** Anouk de Wit, IT-architect
- **E-mailadres contactpersoon:** anouk.dewit@rvig.nl
- **Telefoonnummer contactpersoon:** 06-21458877

## Aanleiding

Veel burgers begrijpen hun eigen registratie in de Basisregistratie Personen (BRP) niet en bellen de RvIG-informatielijn of stappen naar de gemeentelijke publieksbalie met dezelfde standaardvragen: waarom staat een oud adres er nog, wat betekent een verblijfstitelcode, waarom ontbreekt een ouder op de persoonslijst. Dit leidt tot lange wachttijden en hoge uitvoeringskosten bij RvIG en de gemeenten. Sanne pitcht het idee voor een AI-assistent die in begrijpelijke taal uitleg geeft bij de gegevens op de eigen persoonslijst. Het verzoek draagt bij aan de wettelijke taak van RvIG om burgers inzage te geven in hun eigen gegevens en begrijpelijk te informeren, en moet de druk op de informatielijn en de balies verlagen.

## Beoogd doel

Een chat-assistent op MijnOverheid die op basis van de persoonslijst van een ingelogde burger uitleg op maat geeft. De gebruiker kan vragen stellen als "waarom staat mijn vorige adres nog steeds op mijn uittreksel" of "wat betekent de aantekening bij mijn nationaliteit".

## Doelgroep

Ingezetenen die zijn ingeschreven in de BRP, primair de groep die nu naar de RvIG-informatielijn belt of bij de gemeentebalie aanklopt (geschat 1,2 miljoen vragen per jaar over de eigen registratie). Niet bedoeld voor gemeentelijke burgerzaken-medewerkers of andere professionele afnemers van de BRP.

## Eerste gedachten over data

- We hebben toegang nodig tot de persoonslijst van de ingelogde burger (BSN, NAW, nationaliteit, burgerlijke staat, ouder- en kindgegevens, adreshistorie).
- Het model moet gegrond worden op de Wet BRP, het Logisch Ontwerp BRP en de Handleiding Uitvoeringsprocedures (HUP) die RvIG zelf publiceert.
- Voor de generatieve component overwegen we een commercieel LLM (Azure OpenAI) of een gehoste open-source variant.

## Eerste zorgen

- **Privacy:** verwerking van BSN en gegevens over nationaliteit en verblijfstitel — bijzondere categorieën zijn in beeld — vraagt om een volledige DPIA.
- **Hallucinatie:** een onjuist antwoord over nationaliteit of verblijfstitel kan grote gevolgen hebben voor de rechtspositie van een burger — Joost wil een mechanisme om altijd door te verwijzen naar de officiële bron.
- **Aansprakelijkheid:** wie is verantwoordelijk als de assistent een verkeerde uitleg geeft en een burger daardoor geen correctieverzoek indient?

## Aanmelding bij het intakeboard

- **Typering van de aanvraag:** regulier dienstverlening — het betreft een verbetering van de bestaande digitale dienstverlening aan burgers via MijnOverheid, geen tijdelijk project.
- **Doelgroep en omvang:** ingezetenen met een registratie in de BRP, primair de circa 1,2 miljoen vragen per jaar over de eigen persoonslijst.
- **Urgentie en deadline:** de directie wil een werkend prototype voor de interne demo in Q3 2026; livegang op MijnOverheid is voorzien vóór de inwerkingtreding van de gewijzigde Wet BRP in 2027. De prescan DPIA moet daarom uiterlijk juni 2026 zijn afgerond.
- **Afhankelijkheden:** afronding van de prescan DPIA, de RAG-implementatie op de Wet BRP en het Logisch Ontwerp, en de koppeling met de BRP-verstrekkingsvoorziening en MijnOverheid.
- **Benodigde resources:** circa 2 data scientists, 1 architect en 1 UX-ontwerper gedurende 6 maanden, plus de verbruikskosten van Azure OpenAI. Grove kostenraming voor de initiatieffase: € 100.000.
- **Financiering / budget:** centraal budget bij CDIO (innovatiemiddelen Digitale Overheid).

## Overwogen alternatieven

- Uitbreiding van de statische toelichting op rvig.nl en de gemeentelijke websites — afgewezen omdat die geen uitleg op maat per individuele persoonslijst kan geven.
- Opschaling van de bezetting van de RvIG-informatielijn — afgewezen vanwege de structureel hoge kosten.
- Een AI-assistent met menselijke fallback (doorverwijzing naar de informatielijn of de gemeente) — gekozen richting.

## Volgende stappen

1. Mark maakt een technische schets van de architectuur (RAG-aanpak op de Wet BRP en het Logisch Ontwerp + tooling voor opvragen persoonslijstgegevens).
2. Joost start een prescan DPIA om te bepalen of een volledige DPIA verplicht is.
3. Sanne plant een kickoff-meeting met FG, CISO en juridische afdeling voor begin april.
