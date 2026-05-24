# RM-Solution — Contesto progetto per Claude Code

> Questo file fornisce a Claude Code (e a chiunque altro lavori sul progetto) il contesto
> completo necessario per modificarlo senza rompere le scelte già fatte.

---

## Identità del progetto

- **Sito**: `rm-solution.it` (in fase di puntamento DNS)
- **URL temporaneo Cloudflare**: `https://rm-solution.marco-59e.workers.dev`
- **Proprietario**: Marco Regalia — libero professionista in regime forfettario
- **Denominazione fiscale ufficiale**: `RM-Solution di Regalia Marco`
- **P.IVA**: `IT 04098630124` (attiva dal 01/09/2025)
- **Sede**: 21013 Gallarate (VA), Italia
- **Email principale**: `info@rm-solution.it` (su Microsoft 365)
- **Telefono**: `+39 347 540 0385`
- **LinkedIn**: `/in/marcoregalia`

## Posizionamento

Il sito presenta Marco Regalia come **Fractional CTO** e **Senior IT Advisor**.
Quindici anni di esperienza sul campo in infrastrutture, cloud ibrido, cybersecurity,
disaster recovery.

**Target audience** (in ordine di priorità):
1. PMI manifatturiere e di servizi della provincia di Varese/Milano (20-150 dipendenti)
2. Startup in fase di scale-up che vogliono un CTO part-time
3. Studi professionali (commercialisti, avvocati, notai) — focus su compliance GDPR
4. Aziende medie che vogliono affiancamento al team IT interno

**Tono di voce**: diretto, tecnico ma accessibile, niente buzzword.
Mix di tre registri: (a) competenza concreta dal campo, (b) educativo/mentor, (c) storytelling
con casi reali. Mai provocatorio.

---

## Stack tecnico

- **Framework**: Astro 4.16+ (static site generator)
- **Linguaggio**: TypeScript (`.astro` + frontmatter tipizzato)
- **Output**: HTML statico puro, **nessuna integrazione framework UI** (no React/Vue/Svelte)
- **Node**: v20+ richiesto
- **Package manager**: npm

**Integrazioni Astro attualmente attive**:
- *Nessuna* (il plugin `@astrojs/sitemap` è stato temporaneamente disattivato perché
  aveva un bug — vedi commit `fc4cfec`. Da riattivare in futuro con la versione fixata.)

**Servizi terze parti integrati** (tutti caricati via `<script>` nel `BaseLayout`):
- **Iubenda Cookie Solution** con autoblocking
  - `siteId`: `4226928`
  - `cookiePolicyId`: `45743030`
  - Banner top-center, perPurposeConsent attivo, closeButtonRejects attivo
- **Google Analytics 4**
  - Measurement ID: `G-P6X8826TVQ`
  - `anonymize_ip` attivo, bloccato dall'autoblocking Iubenda fino al consenso
- **Formspree**: non ancora configurato (form di contatto contiene placeholder `YOUR_FORM_ID`)

---

## Design system

**Palette colori**:
- `--bg-dark: #0c1424` — blu notte profondo, sfondo hero/footer/sezioni scure
- `--bg-darker: #080f1d` — variante più scura per footer
- `--bg-paper: #ffffff` — sfondo pagina
- `--bg-soft: #f6f9fc` — sfondo sezioni alternate (`.section.alt`)
- `--blue: #1e90ff` — accento azzurro elettrico (su sfondo scuro)
- `--blue-deep: #0c70d9` — variante più scura dell'accento (su sfondo chiaro per contrasto)
- `--text: #0c1424` — testo principale
- `--text-soft: #425466` — testo secondario
- `--muted: #8898aa` — testo terziario / label

**Tipografia**:
- **Body / Headings**: `Inter` (300-700, da Google Fonts)
- **Monospace / label**: `JetBrains Mono` (per `.section-num`, `eyebrow`, etichette tipografiche)
- **No serif** — è stata esplicitamente rifiutata in fase di design

**Componenti chiave riusabili** (in `src/components/`):
- `Header.astro` — sticky nav dark con logo e pulsante outline "Contattami"
- `Hero.astro` — sezione dark con tag-pill, h1 grande, CTA + stats
- `Target.astro` — 4 card cliente con icone SVG inline
- `Services.astro` — lista a righe con icone, frecce blu hover
- `Bio.astro` — bio + card profilo dark + griglia certificazioni con check
- `Cases.astro` — card con bordo blu sinistro + badge risultato
- `ContactCTA.astro` — sezione dark finale con pulsante outline
- `Footer.astro` — footer ultra-scuro con blocco dati legali

---

## Architettura SEO + legale

- **Schema.org**: `ProfessionalService` con tutti i dati reali (nome, P.IVA, indirizzo, founder) — vedi `BaseLayout.astro`
- **Open Graph + Twitter Cards** completi
- **Theme color**: `#0c1424` (coerente con palette)
- **Canonical URL** automatico
- **Pagine legali** obbligatorie già presenti:
  - `/privacy/` — riassunto + embed Iubenda
  - `/cookie/` — riassunto + bottone "Apri preferenze cookie" + embed Iubenda
  - `/note-legali/` — info fiscali complete + foro competente (Busto Arsizio)

---

## Convenzioni di sviluppo

### Struttura pagine

- 5 sezioni numerate in homepage, sempre nello stesso ordine:
  - **01** Target (chi sono i clienti tipo)
  - **02** Servizi (le 5 aree di intervento)
  - **03** Profilo (bio + certificazioni)
  - **04** Casi studio (3 ultimi pubblicati)
  - **05** Contatti (CTA finale)

### Numerazione sezioni
- Ogni sezione mostra un `eyebrow` mono uppercase tipo `— 01 Target`
- Lo stile è gestito dalla classe `.section-num` in `global.css`

### Casi studio
- Pubblicati in markdown sotto `src/content/casi-studio/`
- Schema validato con Zod in `src/content/config.ts`
- Ordinati per `pubDate`, i 3 più recenti compaiono in homepage
- Campo `draft: true` per non pubblicare ancora

### Componenti
- File `.astro` in PascalCase
- Frontmatter (`---`) per logica e props tipizzate
- Stili **scoped** dentro `<style>` del componente (preferito a CSS globale)

### Pagine
- Routing file-based: `src/pages/<nome>.astro` → `/<nome>/`
- Per dettagli dinamici: `[...slug].astro` (vedi `casi-studio/[...slug].astro`)

---

## File / Componenti delicati — NON modificare senza capire l'impatto

| File | Perché è delicato |
|------|-------------------|
| `src/layouts/BaseLayout.astro` | Contiene script Iubenda + GA4 + Schema.org. Modifica sbagliata = rompi tracking/compliance |
| `src/styles/global.css` | Design system globale. Modifiche qui hanno effetto a cascata su tutto |
| `astro.config.mjs` | Sitemap è disattivato di proposito (bug noto del plugin). Non riattivare senza verificare |
| `.gitignore` | Esclude `node_modules`, `.astro`, `dist` — non aggiungere altri ignore senza motivo |

---

## Comandi principali

```bash
# Sviluppo locale
npm install                  # solo prima volta
npm run dev                  # avvia su http://localhost:4321
npm run build                # genera dist/ statico
npm run preview              # anteprima dist/

# Deploy automatico
git add .
git commit -m "Descrizione modifica"
git push                     # Cloudflare deploya automaticamente in 2 min
```

---

## Lavori futuri pianificati (in ordine di priorità)

1. **Configurare Formspree** — il form contatti ha placeholder `YOUR_FORM_ID` in `src/pages/contatti.astro`
2. **Mappa Google in pagina Contatti** — Iubenda è già configurato per Google Maps Widget
3. **Riattivare sitemap.xml** quando il plugin `@astrojs/sitemap` ha la fix per Astro 4.x
4. **Switch DNS** del dominio `rm-solution.it` da Aruba ai nameserver Cloudflare per puntare al sito
5. **Generatore di post AI per LinkedIn/blog** (progetto separato già discusso)
6. **Sezione blog** (predisposta in `src/content/blog/` ma non ancora attiva)
7. **Pagina dedicata "Servizi" estesa** con dettaglio per ogni area
8. **Codice fiscale nel footer** — in attesa di conferma dal commercialista

---

## Cose da NON fare

- **Non installare React/Vue/Svelte** senza un motivo concreto e documentato
- **Non aggiungere CSS framework pesanti** (Bootstrap, Material) — il design system custom è già completo
- **Non modificare `BaseLayout.astro`** senza verificare che Iubenda + GA4 continuino a funzionare
- **Non committare `node_modules/`**, `dist/`, `.astro/`
- **Non cambiare il dominio nel BaseLayout** (`Astro.site` punta a `https://www.rm-solution.it`)
- **Non rimuovere il `theme-color`** `#0c1424` — è la base del design

---

## Ambiente di sviluppo locale

- **OS**: Linux Mint (VM)
- **Accesso**: SSH (utente `marco`)
- **Path progetto**: `/home/marco/Documents/rm-solution`
- **Editor**: VS Code (con estensione Astro ufficiale)
- **Repository GitHub**: [`marcoregalia/rm-solution`](https://github.com/marcoregalia/rm-solution)
- **Branch principale**: `main`
- **Auth GitHub**: HTTPS + Personal Access Token

---

## Storico delle decisioni di design

Per riferimento futuro, alcune scelte sono state prese **dopo** aver esplorato alternative:

1. **Astro vs WordPress**: scelto Astro per zero manutenzione, sicurezza by design (sito statico), performance Lighthouse 100/100, coerenza con il posizionamento "Senior IT Advisor"
2. **Cloudflare Pages vs Aruba hosting**: scelto Cloudflare per deploy automatico Git, CDN globale, costo zero
3. **Palette deep blue + electric blue**: prima è stato proposto un design editoriale (serif + carta + navy soft), poi rifiutato come "troppo da studio professionale". La direzione attuale prende ispirazione dichiarata da Stripe e Linear
4. **Iubenda Free vs Pro**: scelto Free come baseline, accettando che le policy siano hosted su iubenda.com. Upgrade a Pro pianificato quando il sito sarà su rm-solution.it
5. **GA4 vs Plausible/altri**: scelto GA4 perché familiare, anche se più "invasivo" dal lato privacy — gestito correttamente via Iubenda autoblocking
