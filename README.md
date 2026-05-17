# RM-Solution — Sito web

Sito personale di Marco Regalia, Fractional CTO e Senior IT Advisor.
Costruito con [Astro](https://astro.build/) — sito statico, zero database, zero pannelli da mantenere.

---

## Indice

1. [Cosa serve per iniziare](#cosa-serve)
2. [Avvio rapido in locale](#avvio-rapido)
3. [Struttura del progetto](#struttura)
4. [Modificare i contenuti](#contenuti)
5. [Pubblicare un nuovo caso studio](#nuovo-caso)
6. [Configurare il form di contatto](#form-contatto)
7. [Mettere il sito online (deploy)](#deploy)
8. [Aggiornamenti futuri](#aggiornamenti)

---

## <a id="cosa-serve"></a>1. Cosa serve per iniziare

- **Node.js 18 o superiore** — verifica con `node --version`
- Un editor (VS Code consigliato)
- Un terminale
- Un account GitHub (per il deploy)
- Un dominio già registrato (`rm-solution.it`)

Niente database, niente WordPress, niente cPanel.

---

## <a id="avvio-rapido"></a>2. Avvio rapido in locale

Apri il terminale nella cartella del progetto ed esegui:

```bash
npm install
npm run dev
```

Il sito sarà disponibile su `http://localhost:4321`.
Modifica un file `.astro` o `.md` e vedrai l'aggiornamento in tempo reale.

Per generare la versione di produzione:

```bash
npm run build
```

I file pronti per il deploy finiscono nella cartella `dist/`.

---

## <a id="struttura"></a>3. Struttura del progetto

```
rm-solution/
├── public/                    # File statici (favicon, robots.txt, og-image)
├── src/
│   ├── assets/                # Immagini ottimizzate da Astro
│   ├── components/            # Pezzi riutilizzabili (Header, Hero, ecc.)
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── Target.astro
│   │   ├── Approach.astro
│   │   ├── Services.astro
│   │   ├── Bio.astro
│   │   ├── Cases.astro
│   │   └── ContactCTA.astro
│   ├── content/
│   │   ├── config.ts          # Schema dei contenuti
│   │   ├── blog/              # Articoli (vuota all'avvio)
│   │   └── casi-studio/       # Casi studio in markdown
│   ├── layouts/
│   │   └── BaseLayout.astro   # Template base con SEO
│   ├── pages/
│   │   ├── index.astro        # Homepage
│   │   ├── servizi.astro
│   │   ├── chi-sono.astro
│   │   ├── contatti.astro
│   │   └── casi-studio/
│   │       ├── index.astro    # Lista casi studio
│   │       └── [...slug].astro # Singolo caso studio
│   └── styles/
│       └── global.css         # Design system globale
├── astro.config.mjs           # Configurazione Astro
├── package.json
└── tsconfig.json
```

---

## <a id="contenuti"></a>4. Modificare i contenuti

### Cambiare i testi della homepage

Ogni sezione della homepage è un componente in `src/components/`.
I testi sono direttamente nel file `.astro` corrispondente, all'inizio (nel blocco `---`)
o nel template HTML.

**Esempio**: per cambiare l'headline dell'hero, apri `src/components/Hero.astro` e cerca
`<h1>...</h1>`.

### Cambiare i servizi

I cinque servizi sono definiti come array in `src/components/Services.astro`.
Modifica titolo o descrizione direttamente lì.

### Cambiare le certificazioni

Stesso pattern: array all'inizio di `src/components/Bio.astro`.
Aggiungi o rimuovi voci come preferisci.

### Cambiare i target

In `src/components/Target.astro`, sempre come array all'inizio.

---

## <a id="nuovo-caso"></a>5. Pubblicare un nuovo caso studio

Crea un file markdown in `src/content/casi-studio/` con un nome descrittivo (es: `migrazione-azure-pmi.md`).

Schema obbligatorio:

```markdown
---
title: "Titolo del caso studio"
settore: "Settore del cliente"
dimensione: "Numero utenti o dipendenti"
risultato: "— risultato chiave"
durata: "Durata progetto"
pubDate: 2026-01-15
draft: false
---

## Il contesto

Testo del caso studio in markdown standard...
```

- `draft: true` → il caso non viene pubblicato (utile per le bozze).
- `pubDate` ordina i casi (i più recenti per primi).
- Salva il file: il sito si aggiorna automaticamente in dev, e al prossimo build in produzione.

---

## <a id="form-contatto"></a>6. Configurare il form di contatto

Il form in `src/pages/contatti.astro` usa **Formspree** (servizio gratuito fino a 50 messaggi/mese).

### Setup in 3 minuti:

1. Vai su [formspree.io](https://formspree.io/) e crea un account gratuito
2. Crea un nuovo form con il tuo email `marco@rm-solution.it`
3. Copia il "Form ID" (formato: `xrgzabcd`)
4. Apri `src/pages/contatti.astro` e sostituisci `YOUR_FORM_ID` con il tuo ID:

```html
action="https://formspree.io/f/xrgzabcd"
```

### Alternative

- **Cloudflare Pages Functions** (gratuito illimitato, richiede 1 ora di setup)
- **Resend + Cloudflare Workers** (consigliato se vuoi inviare email transazionali)
- **Web3Forms** (alternativa a Formspree, gratuito illimitato)

Dimmi quando vuoi cambiare provider e adattiamo il codice.

---

## <a id="deploy"></a>7. Mettere il sito online (deploy)

### Opzione A — Cloudflare Pages (raccomandato, gratis)

1. **Push del progetto su GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin git@github.com:tuo-username/rm-solution.git
   git push -u origin main
   ```

2. **Connetti il repository a Cloudflare Pages**
   - Vai su [dash.cloudflare.com](https://dash.cloudflare.com/) → Workers & Pages → Create
   - Connect to Git → seleziona il repository
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Save and Deploy

3. **Configura il dominio**
   - In Cloudflare Pages → Custom Domains → Set up custom domain
   - Aggiungi `rm-solution.it` e `www.rm-solution.it`
   - Cloudflare ti dirà quali record DNS configurare presso il tuo registrar

4. **Da ora in poi**: ogni `git push` deploya automaticamente in produzione.

### Opzione B — Vercel

Stesso flow ma su [vercel.com](https://vercel.com/). Anche qui gratis per uso personale.

### Opzione C — Hosting tradizionale (Aruba, Register, ecc.)

Esegui `npm run build` localmente e carica via FTP il contenuto della cartella `dist/`.
Sconsigliato — perdi i deploy automatici.

---

## <a id="aggiornamenti"></a>8. Aggiornamenti futuri

### Aggiornare le dipendenze

Una volta al mese:

```bash
npm outdated     # vedi cosa è obsoleto
npm update       # aggiorna le minor/patch
```

Per aggiornamenti major (es. Astro 4 → Astro 5), leggi prima la guida di migrazione.

### Idee di evoluzione

- **Sezione blog**: già predisposta in `src/content/blog/`. Crea un file markdown e una pagina
  `src/pages/blog/index.astro` per la lista (chiedimelo quando vuoi attivarla).
- **Generatore di post AI**: come da progetto separato discusso in chat.
- **Form di prenotazione con calendario**: integrazione con Cal.com o Calendly.
- **Newsletter**: integrazione con Buttondown o Resend.

---

## Contatti tecnici

Per modifiche al sito o aggiunte di funzionalità, riprendi la conversazione con Claude.
Tutto il codice è documentato e modificabile in autonomia.
