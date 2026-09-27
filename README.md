# RoxyAPI node for n8n: astrology, horoscopes, tarot and numerology in any workflow or AI Agent

[![npm](https://img.shields.io/npm/v/@roxyapi/n8n-nodes-roxyapi)](https://www.npmjs.com/package/@roxyapi/n8n-nodes-roxyapi)
[![CI](https://github.com/RoxyAPI/n8n-nodes-roxyapi/actions/workflows/ci.yml/badge.svg)](https://github.com/RoxyAPI/n8n-nodes-roxyapi/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/RoxyAPI/n8n-nodes-roxyapi/blob/main/LICENSE)

**The official RoxyAPI community node for [n8n](https://n8n.io/).** One node and one API key cover Western astrology, Vedic astrology, astrology forecasts, Human Design, Chinese astrology and BaZi, feng shui, Mayan astrology, Vastu, numerology, Kabbalah, tarot, biorhythm, Ayurveda, I Ching, crystals, dream interpretation, angel numbers, and city and timezone lookup. Every calculation is verified against NASA JPL Horizons, and the node runs as a normal workflow step or as a tool for the n8n AI Agent.

Build a daily horoscope newsletter, a natal chart on every form submission, a tarot reading chat bot, or an AI astrologer that picks the right calculation on its own, without writing a single HTTP request.

## How do I install the RoxyAPI node in n8n?

1. In n8n, open **Settings → Community Nodes → Install**.
2. Enter `@roxyapi/n8n-nodes-roxyapi` and confirm.
3. Add a node to any workflow and search for **RoxyAPI**, or for what you need: horoscope, natal chart, tarot, numerology, kundli.

The [n8n community node installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) covers every install path.

## Connect your API key

1. Get a key at [roxyapi.com/pricing](https://roxyapi.com/pricing). One key covers every domain below.
2. In the node, open **Credential to connect with**, choose **Create new credential**, and paste the key.
3. Save. n8n checks the key at once and stores it encrypted, so it never appears in node fields or in an exported workflow.

## What can the node do?

Pick a **Resource** (the domain), then an **Operation** (the calculation). Required inputs show as fields; everything optional, including the response language, sits under **Options**.

<!-- BEGIN:RESOURCES -->
261 operations across 20 resources, one per RoxyAPI domain, in the order the API lists them.

| Resource | Operations |
|---|---|
| Western Astrology | 39 |
| Vedic Astrology | 58 |
| Forecast | 5 |
| Human Design | 12 |
| Chinese Astrology | 16 |
| Feng Shui | 11 |
| Mesoamerican Astrology | 18 |
| Vastu | 10 |
| Numerology | 20 |
| Kabbalah | 12 |
| Tarot | 10 |
| Biorhythm | 6 |
| Ayurveda | 8 |
| I-Ching | 9 |
| Crystal and Healing Stone | 12 |
| Dream | 5 |
| Angel Number | 4 |
| Location and Timezone | 3 |
| Usage | 1 |
| Language | 2 |
<!-- END:RESOURCES -->

Every operation is listed at the end of this page.

## Which operations should I start with?

The calculations most products are built on, one row per domain:

| Resource | Start with |
|---|---|
| Western Astrology | Generate Natal Chart, Get Daily Horoscope, Calculate Synastry, Get Current Moon Phase |
| Vedic Astrology | Generate Birth Chart, Get Detailed Panchang, Get Current Dasha, Check Manglik Dosha, Calculate Gun Milan, Get Kp Ruling Planets |
| Forecast | Forecast Transits, Generate Timeline |
| Human Design | Generate Bodygraph, Calculate Connection |
| Chinese Astrology | Generate Bazi Chart, Calculate Zodiac Animal, Get Almanac Day |
| Feng Shui | Calculate Kua Number, Generate Flying Star Chart |
| Mesoamerican Astrology | Calculate Tzolkin, Generate Mayan Chart |
| Vastu | Calculate Entrance Pada, Calculate Room Compliance |
| Numerology | Calculate Life Path, Generate Numerology Chart, Calculate Personal Year |
| Kabbalah | Calculate Gematria, Generate Birth Profile |
| Tarot | Get Daily Card, Cast Three Card, Cast Celtic Cross, Cast Yes No |
| Biorhythm | Get Reading, Get Forecast |
| Ayurveda | Calculate Ayurvedic Constitution, Get Dinacharya Schedule |
| I-Ching | Cast Reading, List Hexagrams |
| Crystal and Healing Stone | Get Crystals by Zodiac, Get Crystals by Chakra, Get Birthstones |
| Dream | Get Dream Symbol, Search Dream Symbols |
| Angel Number | Get Angel Number, Analyze Number Sequence |

## Can the n8n AI Agent use RoxyAPI as a tool?

Yes. Connect the RoxyAPI node to the **Tool** input of an **AI Agent** node and pick the operation the agent may call, for example Generate Natal Chart, Get Daily Horoscope or Cast Three Card. Click **Let the model define this parameter** on a field and the agent fills it from the conversation, so a message such as "I was born on 15 January 1990 at 14:30 in New York, what is my rising sign?" becomes a real natal chart calculation instead of a guess. Add one RoxyAPI tool per operation you want the agent to have.

## Example: a daily horoscope email for every sign

1. **Schedule Trigger**, every day at 06:00.
2. **RoxyAPI**, resource **Western Astrology**, operation **Get Daily Horoscope**, sign **Aries**. Under **Options**, add **Timezone** with the timezone of your audience, for example `America/New_York`, so the day rolls over on their clock.
3. Any email node, with the `column` field of the previous step as the body: a complete piece of 120 to 180 words, ready to send. For a push notification or SMS, use the 30 to 60 word `overview` instead.

Feed the twelve signs in from a **Code** node instead of fixing **Aries**, and the whole newsletter runs itself.

## How do I send a birth date, time and place?

Charts, compatibility, dasha, panchang and Human Design take a birth moment:

- **Date** as `YYYY-MM-DD` and **Time** as `HH:MM:SS` in 24-hour format, local to the birthplace.
- **Latitude** and **Longitude** in decimal degrees.
- **Timezone** as an IANA name such as `America/New_York` or `Europe/London`, which resolves the correct daylight saving offset for that date, or as decimal hours such as `-5`.

Only have a city name? Run **Location and Timezone**, **Search Cities** first and map its `latitude`, `longitude` and `timezone` into the chart step with expressions.

Operations that compare two people, such as synastry and compatibility, take each person as a JSON object. The field opens with a working example that shows every key.

## Which languages can the response come back in?

Most operations take a **Language** option under **Options**:

<!-- BEGIN:LANGUAGES -->
English (`en`), Turkish (`tr`), German (`de`), Spanish (`es`), Hindi (`hi`), Portuguese (`pt`), French (`fr`), Russian (`ru`), Simplified Chinese (`zh-Hans`), Traditional Chinese (`zh-Hant`).
<!-- END:LANGUAGES -->

## Compatibility

Built and tested with the n8n community node toolchain on n8n 2.x. The node has no runtime dependencies.

## Resources

- [RoxyAPI n8n guide](https://roxyapi.com/docs/integrations/n8n): workflows, AI Agent setup and troubleshooting
- [API reference](https://roxyapi.com/api-reference): every endpoint with request and response examples
- [Methodology](https://roxyapi.com/methodology): how accuracy is verified
- [Remote MCP](https://roxyapi.com/docs/mcp): the same calculations for AI agents and coding assistants
- [RoxyAPI SDKs](https://roxyapi.com/docs/sdk) for TypeScript, Python, PHP, C# and Go, for code outside n8n
- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)

## Every operation

<!-- BEGIN:OPERATIONS -->
### Western Astrology

Western astrology API for natal birth charts, daily, weekly, monthly, and yearly horoscopes with unique content per sign and the dated sky events behind every reading, synastry compatibility scores, composite charts, solar and lunar returns, real-time transit aspects, and moon phases. 4 house...

- **List Zodiac Signs**: Get all zodiac signs: Complete zodiac signs list with dates and elements
- **Get Zodiac Sign**: Get zodiac sign details: Complete astrology sign profile with personality traits
- **List Planet Meanings**: Get all planet meanings: Complete astrology planet interpretations list
- **Get Planet Meaning**: Get planet meaning details: Complete astrology planet interpretation
- **Generate Natal Chart**: Generate natal chart: Birth chart calculator API with houses and aspects
- **Get Planetary Positions**: Get planetary positions: Ephemeris calculator for all planets
- **Get Monthly Tropical Ephemeris**: Monthly Ephemeris: Daily tropical planetary positions for a month
- **Get Current Moon Phase**: Get current moon phase: Lunar phase calculator with zodiac sign
- **Get Upcoming Moon Phases**: Get upcoming moon phases: Next new moon, full moon, quarters
- **Get Moon Calendar**: Get lunar calendar: Moon phases for entire month
- **Calculate Synastry**: Calculate synastry: Relationship compatibility analysis API
- **Calculate Houses**: Calculate house cusps: House system calculator with comparison
- **Calculate Aspects**: Calculate planetary aspects: Aspect finder for any date and time
- **Get Monthly Tropical Aspects**: Monthly Aspects: Tropical aspect calendar for an entire month
- **Detect Aspect Patterns**: Detect aspect patterns: Grand Trine, Kite, T-Square, Grand Cross, Yod, Mystic Rectangle, Stellium
- **Calculate Transits**: Calculate planetary transits: Current transits with natal chart comparison
- **Get Monthly Tropical Transits**: Monthly Transits: Tropical sign ingresses for an entire month
- **Calculate Transit Aspects**: Transit Aspects: Detailed transit-to-natal aspect analysis with interpretations
- **Get Monthly Declination Parallels**: Monthly Parallels: Declination contacts for an entire month
- **Get Planetary Node Passages**: Ecliptic Crossings: Node passages for a whole year
- **Generate Solar Return**: Solar Return Chart: Annual birthday forecast with relocated chart
- **Generate Lunar Return**: Lunar Return Chart: Monthly emotional forecast with Moon cycle chart
- **Generate Composite Chart**: Composite Chart: Midpoint relationship chart with interpretations
- **Calculate Compatibility**: Compatibility score: Relationship compatibility API
- **Get Daily Horoscope**: Daily horoscope by zodiac sign: Transit-based editorial columns
- **Get Weekly Horoscope**: Weekly horoscope by zodiac sign: Seven-day editorial column
- **Get Monthly Horoscope**: Monthly horoscope by zodiac sign: Editorial column with key dates
- **Get Yearly Horoscope**: Yearly horoscope by zodiac sign: Year ahead forecast with themes, key periods, eclipses and retrogrades
- **Generate Planetary Return**: Planetary Return Chart: Saturn return, Jupiter return, and inner planet cycles
- **Generate Astrocartography**: Astrocartography map: planetary lines and relocation calculator
- **Generate Relocation Chart**: Generate relocation chart: Relocated birth chart calculator with shifted houses and angles
- **Generate Local Space**: Local space astrology map: Directional planetary compass lines
- **Generate Fixed Stars**: Fixed stars and star conjunctions calculator: Regulus, Spica, Algol natal report
- **Calculate Arabic Lots**: Arabic lots calculator: seven Hermetic parts including Part of Fortune and Spirit
- **Generate Asteroids**: Asteroid goddesses calculator: Ceres, Pallas, Juno, and Vesta natal positions
- **Generate Lilith**: Black Moon Lilith calculator: mean and true lunar apogee in the natal chart
- **Generate Progressions**: Secondary progressions calculator: progressed chart, progressed Sun and Moon
- **Generate Solar Arc**: Solar arc directions calculator: directed chart at one degree per year
- **Generate Profections**: Annual profections calculator: lord of the year and yearly time lord by age

### Vedic Astrology

Vedic astrology (Jyotish) and KP API for kundli generation with the sixteen Shodasavarga divisional charts (D1 to D60), panchang with choghadiya, hora and the classical muhurta windows, kundli matching by Ashtakoot Gun Milan, the South Indian ten porutham with Rajju and Vedha vetoes and...

- **Generate Birth Chart**: Get birth chart (D1 Rashi chart): Kundli Calculator API
- **Generate Navamsa**: Get Navamsa chart (D9): Marriage Compatibility Calculator
- **Generate Divisional Chart**: Get divisional chart (Varga): D2 to D60 Calculator
- **Calculate Gun Milan**: Calculate compatibility score: Gun Milan API (Ashtakoot Matching)
- **Calculate Dashakoot**: Calculate ten porutham match: Dashakoot South Indian Kundli Matching API
- **Calculate Papasamyam**: Compare malefic affliction: Papasamyam Kundli Matching API
- **Get Planet Positions**: Get planetary positions: Graha Positions API
- **Get Monthly Ephemeris**: Monthly Ephemeris: Daily sidereal planetary positions for a month
- **Get Current Dasha**: Get current Mahadasha, Antardasha, Pratyantardasha, Sookshma, Prana: Dasha Calculator API
- **Get Major Dashas**: Get all 9 Mahadasha periods (120-year cycle)
- **Get Sub Dashas**: Get all Antardashas (sub-periods) for a specific Mahadasha
- **Get Pratyantardashas**: Get all Pratyantardashas (antara periods) for a Mahadasha and Antardasha
- **Get Sookshma Dashas**: Get all Sookshma dashas for a Mahadasha, Antardasha and Pratyantardasha
- **Get Prana Dashas**: Get all Prana dashas for a Mahadasha, Antardasha, Pratyantardasha and Sookshma
- **Get Vedic Daily Reading**: Daily Reading: Composed Gochara, Panchanga and Dasha for one native on one day
- **Get Basic Panchang**: Get basic Panchang: Tithi Nakshatra Yoga Karana Calculator
- **Get Detailed Panchang**: Get detailed Panchang with Rahu Kaal, Yamaganda, Gulika
- **Get Choghadiya**: Get Choghadiya: 8 Muhurta divisions of day and night
- **Get Hora**: Get Hora: 24 Planetary Hours (12 day + 12 night)
- **Check Manglik Dosha**: Check Manglik Dosha: Mangal Dosha Calculator API
- **Check Kalsarpa Dosha**: Check Kalsarpa Dosha: Kalsarpa Yoga Calculator API
- **Check Sadhesati**: Check Sadhesati: Sade Sati Calculator API (Saturn Transit)
- **List Yogas**: List all planetary yogas: 301 entry Vedic Yoga Glossary
- **Get Yoga**: Get yoga details by ID: Vedic Yoga Glossary Entry
- **Detect Yogas**: Detect classical Vedic yogas in a birth chart
- **Get Kp Ayanamsa**: Get KP-Newcomb ayanamsa: Dynamic daily calculation
- **Get Kp Planets**: Get KP planetary positions with sub-lords
- **Get Kp Cusps**: Get KP Placidus house cusps with sub-lords
- **Generate Kp Chart**: Generate complete KP birth chart
- **Get Kp Ruling Planets**: Get KP ruling planets with optional significators
- **Get Kp Ruling Interval**: Get KP ruling planets with significators at intervals
- **Get Kp Sublord Changes**: Find KP sublord changes
- **Get Kp Rasi Changes**: Find KP rasi ingress times
- **Get Kp Planets Interval**: Get KP planets at time intervals
- **Cast Kp Horary Chart**: Cast a KP horary (Prashna) chart from a number 1-249: KP Horary API
- **Get Kp Daily Finance**: Daily finance score from four KP sub lord layers: KP Daily Finance API
- **Calculate Drishti**: Get planetary aspects (Drishti): Mutual aspects between all planets
- **Get Monthly Aspects**: Monthly Planetary Aspects: Major and minor aspect events for a month
- **Get Lunar Aspects**: Monthly Lunar Aspects: Moon aspect events with all planets for a month
- **Calculate Transit**: Transit Analysis: Compare current planets to natal chart (Gochar)
- **Get Monthly Transits**: Monthly Transit: Planetary sign changes for an entire month
- **Calculate Parallels**: Declination Parallels: Planets at same or opposite declination
- **Get Monthly Parallels**: Monthly Declination Parallels: Parallel and contraparallel events for a month
- **Get Ecliptic Crossings**: Ecliptic Crossings: When planets cross the ecliptic plane
- **List Rashis**: List all 12 Rashis: Vedic Zodiac Signs Reference
- **Get Rashi**: Get Rashi by ID: Vedic Zodiac Sign Detail
- **List Nakshatras**: List all 27 Nakshatras: Lunar Mansions Reference
- **Get Nakshatra**: Get Nakshatra by ID: Lunar Mansion Detail
- **Get Upagraha Positions**: Get upagraha (sub-planet) positions: Upagraha Calculator API
- **Calculate Ashtakavarga**: Get Ashtakavarga (planetary strength) analysis: Ashtakavarga Calculator API
- **Calculate Shadbala**: Get Shadbala (six-fold planetary strength) analysis: Shadbala Calculator API
- **List Avasthas**: List all 17 avastha states: Planetary State Reference
- **Get Avastha**: Get avastha by ID: Planetary State Detail
- **Calculate Arudha Padas**: Get the twelve Arudha padas: Arudha Lagna Calculator API
- **Calculate Chara Karakas**: Get Chara Karakas including Atmakaraka: Jaimini Karaka Calculator API
- **Calculate Bhava Bala**: Get Bhava Bala (house strength) for all twelve houses: Bhava Bala Calculator API
- **Calculate Bhav Chalit**: Get the Bhav Chalit (Chalit Kundli) cusp-based house chart: Bhav Chalit API
- **Get Heliacal Visibility**: Heliacal rising and setting (udaya and asta): Graha Asta Calculator API

### Forecast

Astrology forecast API that merges upcoming transit aspects, sign ingresses, retrograde stations, new and full moons, biorhythm critical days, and Vimshottari dasha changes into one time-ordered forecast for a single subject.

- **Generate Timeline**: Cross-domain forecast timeline: Transits, ingresses, stations, dasha changes, critical days
- **Forecast Transits**: Western astrology forecast: aspects, ingresses, stations, eclipses, moon phases
- **Find Significant Dates**: Significant dates: High-significance cross-domain forecast highlights
- **Generate Digest**: Forecast digest: Pre-summarized next 24h, 7d, 30d, and 90d rollups
- **Forecast Solar Return**: Solar return chart: Annual birthday forecast chart for a single subject

### Human Design

Human Design API that generates the full bodygraph from a birth moment: type, strategy, inner authority, profile, definition, incarnation cross, the nine centers, defined channels, and all 26 gate activations, plus two-person connection charts and small-group Penta analysis.

- **Generate Bodygraph**: Generate full Human Design bodygraph: Type, authority, profile, centers, channels, gates
- **Calculate Connection**: Calculate Human Design connection chart: Two-person composite bodygraph compatibility
- **Calculate Penta**: Calculate Human Design Penta: Small-group BG5 operating system for three to five people
- **Generate Transit**: Generate Human Design transit overlay: Current planetary activations on a natal bodygraph
- **Calculate Type**: Calculate Human Design type, authority and profile
- **Calculate Gates**: Calculate the 26 Human Design gate activations
- **Get Gate**: Look up a Human Design gate by number
- **Calculate Channels**: Calculate the defined Human Design channels
- **Calculate Centers**: Calculate the nine Human Design centers
- **Get Center**: Look up a Human Design center by id
- **Calculate Profile**: Calculate the Human Design profile and line keynotes
- **Calculate Variables**: Calculate Human Design Variables: The four arrows and Color, Tone, Base substructure

### Chinese Astrology

Chinese zodiac and BaZi astrology API: Four Pillars charts, Chinese zodiac signs and the Chinese lunisolar calendar from any birth moment: year, month, day and hour pillars with hidden stems, Na Yin and Ten God relations, luck pillars, day master strength, and animal compatibility.

- **Generate Bazi Chart**: Generate BaZi chart: Four Pillars of Destiny calculator API
- **Calculate Luck Pillars**: Calculate luck pillars: BaZi Da Yun ten-year cycle API
- **Calculate Day Master Strength**: Calculate Day Master strength: BaZi favorable element API
- **Calculate Bazi Compatibility**: Calculate BaZi compatibility: Four Pillars matchmaking API
- **Calculate Annual Forecast**: Calculate BaZi annual forecast: Liu Nian yearly pillar API
- **List Zodiac Animals**: List the 12 Chinese zodiac animals: Sheng Xiao sign catalogue
- **Get Zodiac Animal**: Get one Chinese zodiac animal: Full sign profile with compatibility partners
- **Calculate Zodiac Animal**: Find the Chinese zodiac animal for a birth date: Sheng Xiao calculator
- **Get Zodiac Compatibility**: Chinese zodiac compatibility: Trine, six harmony, clash and harm analysis
- **Get Daily Zodiac Reading**: Daily Chinese zodiac reading: Day pillar forecast by animal sign
- **List Solar Terms**: List the 24 solar terms: Jie Qi calendar API with exact instants
- **Calculate Lunar Date**: Convert lunar and Gregorian dates: Chinese lunisolar calendar API
- **Get Almanac Day**: Get the almanac for a day: Tong Shu API with day officers and mansions
- **Get Monthly Almanac**: Get a month of almanac days: Chinese calendar month view API
- **Lookup Auspicious Days**: Find auspicious days: Chinese date selection API for weddings and openings
- **List Five Elements**: List the five elements: Wu Xing API with generating and controlling cycles

### Feng Shui

Compute classical feng shui from one API: Xuan Kong flying star natal charts for any of the nine periods and 24 mountains, Kua numbers and the full Eight Mansions map of favourable and unfavourable directions, annual and monthly star plates, the four annual afflictions with exact degree spans,...

- **Calculate Kua Number**: Calculate Kua number: Feng shui personal direction calculator API
- **Get Kua Number**: Look up a Kua number: Eight Mansions reference API
- **Generate Eight Mansions**: Generate Eight Mansions map: Ba Zhai lucky direction API
- **Generate Flying Star Chart**: Generate flying star natal chart: Xuan Kong Fei Xing API
- **Get Annual Flying Stars**: Annual flying stars: Yearly feng shui star chart API
- **Get Monthly Flying Stars**: Monthly flying stars: Month by month feng shui overlay API
- **List Flying Stars**: List the nine flying stars: Xuan Kong star reference API
- **Get Annual Afflictions**: Annual afflictions: Tai Sui, San Sha and Five Yellow API
- **List Bagua Sectors**: List Bagua sectors: Feng shui bagua map API
- **Get Bagua Sector**: Look up a Bagua sector: Life area reference API
- **List Nine Periods**: List the nine periods: San Yuan period table API

### Mesoamerican Astrology

Calculate Mayan astrology day signs, the Tzolkin sacred round, the Haab year, the full Long Count and the Aztec tonalpohualli from any date: day sign and coefficient, trecena, Calendar Round, Lord of the Night, Year Bearer and the five point Cruz Maya, each with a composed reading.

- **Calculate Tzolkin**: Mayan day sign for a date: Tzolkin calculator API
- **Generate Mayan Chart**: Generate a Mayan chart: Tzolkin, Haab and Long Count calculator API
- **Convert Long Count**: Convert a Maya Long Count: Long Count calendar converter API
- **Get Daily Mayan Reading**: Daily Mayan energy reading: Tzolkin day sign of the day API
- **Get Monthly Tzolkin Calendar**: Monthly Tzolkin calendar grid: Maya calendar month API
- **Calculate Mayan Compatibility**: Mayan nawal compatibility: Tzolkin pair analysis API
- **List Mayan Day Signs**: List the 20 Mayan day signs: Tzolkin nawal catalogue API
- **Get Mayan Day Sign**: Get one Mayan day sign: Nawal profile API
- **List Trecenas**: List the 20 Mayan trecenas: Tzolkin thirteen day period API
- **Get Trecena**: Get one Mayan trecena: Thirteen day period profile API
- **List Haab Months**: List the 19 Haab periods: Maya solar calendar month API
- **Get Haab Month**: Get one Haab period: Maya solar calendar month profile API
- **Calculate Tonalpohualli**: Aztec day sign for a date: Tonalpohualli calculator API
- **Get Daily Aztec Reading**: Daily Aztec energy reading: Tonalpohualli day sign of the day API
- **List Aztec Day Signs**: List the 20 Aztec day signs: Tonalpohualli sign catalogue API
- **Get Aztec Day Sign**: Get one Aztec day sign: Tonalpohualli sign profile API
- **List Aztec Trecenas**: List the 20 Aztec trecenas: Tonalpohualli thirteen day period API
- **Get Aztec Trecena**: Get one Aztec trecena: Tonalpohualli period profile API

### Vastu

Vastu Shastra API for directional home and plot analysis: entrance padas with the classical effect of each of the 32 perimeter positions, the Vastu Purusha Mandala projected over a real plot on the 81 pada or the 64 pada grid, room placement checks over a closed room enum, Ayadi shadvarga across...

- **Calculate Entrance Pada**: Calculate entrance pada: Vastu main door direction API
- **Generate Mandala**: Generate Vastu Purusha Mandala: 81 pada and 64 pada grid API
- **Calculate Plot Analysis**: Analyse a plot: Vastu land and site assessment API
- **Calculate Ayadi**: Calculate Ayadi shadvarga: Vastu proportion and yoni calculator API
- **Calculate Room Compliance**: Check room placement: Vastu room direction compliance API
- **Find Griha Pravesh Dates**: Find griha pravesh dates: Vastu house warming muhurta API
- **List Dikpala Directions**: List the eight directions: Vastu dikpala and direction reference API
- **Get Dikpala Direction**: Look up one direction: Vastu dikpala reference API
- **List Devatas**: List the 45 devatas: Vastu Purusha Mandala reference API
- **Get Devata**: Look up one devata: Vastu mandala devata reference API

### Numerology

Numerology API to calculate life path, expression, soul urge, personality, and maturity numbers, with Pinnacle and Challenge life-phase timing, Hidden Passion, Subconscious Self, and Cornerstone and Capstone name analysis.

- **Calculate Life Path**: Calculate Life Path number: Most important numerology calculation
- **Calculate Expression**: Calculate Expression number: Natural talents and life goals
- **Calculate Bridge Numbers**: Calculate Bridge Numbers: Harmonize different aspects of personality
- **Calculate Soul Urge**: Calculate Soul Urge number: Inner motivations and desires
- **Calculate Personality**: Calculate Personality number: How others perceive you
- **Calculate Birth Day**: Calculate Birth Day number: Special talents from day of birth
- **Calculate Maturity**: Calculate Maturity number: Who you become in later life
- **Analyze Karmic Lessons**: Analyze Karmic Lessons: Life lessons from missing numbers
- **Check Karmic Debt**: Detect Karmic Debt numbers: Past life challenges (13, 14, 16, 19)
- **Calculate Personal Day**: Calculate Personal Day: Daily personalized numerology forecast
- **Calculate Personal Month**: Calculate Personal Month: Monthly numerology forecast
- **Calculate Personal Year**: Calculate Personal Year: Annual cycle and forecast for current year
- **Calculate Num Compatibility**: Calculate Compatibility: Relationship dynamics between two people
- **Generate Numerology Chart**: Generate Complete Numerology Chart: Full profile analysis
- **Get Number Meaning**: Get Number Meaning: Interpretation for any number 1-9, 11, 22, 33
- **Get Daily Number**: Get daily numerology number: Number of the Day with interpretation
- **Calculate Chaldean**: Chaldean numerology name reading: Destiny, compound number, planetary ruler
- **Get Compound Number**: Compound number meaning: Cheiro Chaldean interpretation 10 to 52
- **Calculate Dual**: Dual numerology: Pythagorean and Chaldean name numbers in one call
- **Calculate Business Name**: Business name numerology: Chaldean brand name analysis and lucky numbers

### Kabbalah

Kabbalah API for gematria, the 72 names, the Tree of Life and the Hebrew birthday, from one key.

- **Calculate Gematria**: Calculate gematria: Hebrew gematria calculator API with every spelling shown
- **List Gematria Ciphers**: List gematria ciphers: gematria methods API with provenance on every row
- **Generate Name Profile**: Generate a name profile: Kabbalah name numerology API with the spelling shown
- **Generate Birth Profile**: Generate a birth profile: Hebrew birthday and birth angel API
- **List Shem Names**: List the 72 names: Shem HaMephorash API derived from the verses
- **Get Shem Name**: Get one of the 72 names: 72 names of God API by index
- **Get Tree of Life**: Get the Tree of Life: sephirot and 22 paths API with typed school variants
- **Get Sephirah**: Get one sephirah: sefirot meaning API with the paths that touch it
- **List Hebrew Letters**: List the Hebrew letters: Hebrew alphabet API with the Sefer Yetzirah attributions
- **Get Hebrew Letter**: Get one Hebrew letter: Hebrew letter meaning API
- **Calculate Name Compatibility**: Compare two names: gematria name compatibility API with every component published
- **Get Daily Sephirah**: Get the sephirah of the day: Omer count API with the sephirot pairing

### Tarot

Tarot reading API with the complete 78-card Rider-Waite-Smith deck and card meanings for love, career, health, and spiritual growth.

- **List Cards**: List all 78 tarot cards: Tarot deck catalog API
- **Get Card**: Get tarot card by id: Tarot card meaning API
- **Draw Cards**: Draw tarot cards: Seeded tarot draw API
- **Get Daily Card**: Daily tarot card: Card of the day API
- **Cast Yes No**: Yes or no answer: Yes no tarot reading API
- **Cast Three Card**: Three card spread, past present future: Tarot spread API
- **Cast Celtic Cross**: Celtic Cross spread, 10 cards: Tarot spread API
- **Cast Love Spread**: Love spread, 5 cards: Relationship tarot reading API
- **Cast Career Spread**: Career spread, 7 cards: Career tarot reading API
- **Cast Custom Spread**: Custom spread builder: Configurable tarot spread API

### Biorhythm

The most complete biorhythm API: 10 cycle types across 3 primary (physical, emotional, intellectual), 4 secondary (intuitive, aesthetic, awareness, spiritual), and 3 composite (passion, mastery, wisdom).

- **Get Reading**: Get biorhythm reading: Complete cycle analysis for any date
- **Get Forecast**: Get biorhythm forecast: Multi-day cycle predictions with best and worst days
- **Get Critical Days**: Find critical days: Zero crossing detection for any date range
- **Calculate Bio Compatibility**: Calculate compatibility: Biorhythm alignment between two people
- **Get Phases**: Get phase info: Lightweight cycle status for dashboards and widgets
- **Get Daily Biorhythm**: Get daily biorhythm: Seeded reading for daily check-in features

### Ayurveda

Ayurveda API for dosha profiles, the dinacharya daily routine and the ritucharya seasonal regimen, with a verse cited on every value.

- **Calculate Ayurvedic Constitution**: Ayurvedic constitution from a birth chart: Dosha profile API
- **Get Dinacharya Schedule**: Dinacharya daily routine: Brahma muhurta and dosha clock API
- **Get Ritucharya**: Ayurveda seasonal regimen: Ritucharya and ritu resolution API
- **Get Daily Ayurveda Reading**: Daily Ayurveda reading: Dosha clock and brahma muhurta by location API
- **List Doshas**: List the three doshas: Dosha catalogue API
- **Get Dosha**: Get one dosha: Vata pitta kapha profile API
- **List Rasas**: List the six tastes: Ayurveda rasa and dosha matrix API
- **List Gunas**: List the twenty qualities: Ayurveda guna pairs API

### I-Ching

I-Ching oracle API with all 64 hexagrams, 384 changing lines, 8 trigrams, and modern interpretations for love, career, and decision-making.

- **Get Daily Hexagram**: Daily hexagram: Daily I-Ching oracle API
- **Cast Daily Reading**: Cast daily reading with changing lines: I-Ching divination API
- **List Hexagrams**: List all 64 hexagrams: I-Ching hexagram catalog API
- **Get Random Hexagram**: Random hexagram: I-Ching hexagram picker API
- **Lookup Hexagram**: Lookup hexagram by line pattern: I-Ching binary lookup API
- **Get Hexagram**: Get hexagram by number: I-Ching hexagram detail API
- **Cast Reading**: Cast an I-Ching reading: Hexagram divination API
- **List Trigrams**: List all 8 trigrams: Bagua trigram catalog API
- **Get Trigram**: Get trigram by number or name: Bagua trigram detail API

### Crystal and Healing Stone

Crystal healing API covering the most popular and widely-searched healing crystals and gemstones, from Amethyst and Rose Quartz to Moldavite and Selenite, each with its spiritual, emotional, and physical properties.

- **Get Crystals by Zodiac**: Crystals by zodiac sign: Zodiac birthstone API
- **Get Crystals by Chakra**: Crystals by chakra: Chakra healing stones API
- **Get Crystals by Element**: Crystals by element: Elemental crystal lookup API
- **Get Birthstones**: Birthstones by month: Birthstone lookup API
- **Search Crystals**: Search crystals: Crystal search API
- **Get Crystal Pairings**: Crystal pairings: Crystal combination API
- **Get Daily Crystal**: Daily crystal: Crystal of the day API
- **Get Random Crystal**: Random crystal: Crystal discovery API
- **List Crystal Colors**: List crystal colors: Crystal color filter API
- **List Crystal Planets**: List crystal planets: Planetary ruler filter API
- **List Crystals**: List all crystals: Crystal healing database API
- **Get Crystal**: Get crystal by id: Crystal healing properties API

### Dream

Dream interpretation API with a 2,000+ symbol dream dictionary and psychological meanings covering animals, objects, emotions, people, scenarios, and abstract concepts.

- **Search Dream Symbols**: List and search dream symbols: Dream dictionary API
- **Get Random Symbols**: Random dream symbols: Dream symbol discovery API
- **Get Symbol Letter Counts**: Symbol counts by letter: Dream dictionary index API
- **Get Dream Symbol**: Get dream symbol by id: Dream interpretation API
- **Get Daily Dream Symbol**: Daily dream symbol: Dream symbol of the day API

### Angel Number

Angel numbers API with meanings for 111, 222, 333, 444, 555, 666, 777, 888, 999, 1111, and 75+ sequences covering every common family.

- **List Angel Numbers**: List all angel numbers: Angel number catalog API
- **Get Angel Number**: Get angel number meaning: Angel number lookup API
- **Analyze Number Sequence**: Analyze any number sequence: Angel number analysis API
- **Get Daily Angel Number**: Daily angel number: Angel number of the day API

### Location and Timezone

Timezone and location API with city search and geocoding across 235,000+ cities in 240+ countries, returning latitude, longitude, IANA timezone, and DST-aware UTC offset.

- **Search Cities**: Search cities worldwide: Geocoding autocomplete with coordinates and timezone
- **List Countries**: List all countries: ISO codes and city coverage
- **Get Cities by Country**: Get cities in a country: Geocoding directory sorted by population

### Usage

Monitor your API usage, check rate limits, and track request consumption.

- **Get Usage Stats**: Get API usage statistics

### Language

List the response languages accepted by the lang query parameter on every i18n-aware endpoint.

- **Get Field Labels**: Get field labels for a language
- **List Languages**: List supported response languages
<!-- END:OPERATIONS -->

## License

MIT
