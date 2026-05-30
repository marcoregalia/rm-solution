# Logo Integration — RM-Solution

Pacchetto completo per integrare il logo RM-Solution nel sito Astro.

---

## File inclusi

```
public/
├── logo.png           ← Logo trasparente PNG (400×332 px, @2x per retina)
├── logo-light.png     ← Logo variante chiara (R bianco) per footer
├── logo.svg           ← Logo vettoriale (dark, per usi generali)
├── logo-light.svg     ← Logo vettoriale (light, per usi su sfondo scuro)
├── og-image.png       ← OG image 1200×630 px (Facebook, LinkedIn, WhatsApp)
├── favicon.ico        ← Favicon 32×32 .ico (tutti i browser)
└── favicon-512.png    ← Favicon 512×512 (iOS, Android, PWA)

src/
├── components/
│   ├── Logo.astro     ← Componente logo SVG inline (header + footer)
│   ├── Header.astro   ← Header aggiornato con logo
│   └── Footer.astro   ← Footer aggiornato con logo variante light
└── layouts/
    └── BaseLayout.astro ← Layout base con favicon + OG image + Schema.org
```

---

## Come applicare

### 1. Copia i file `public/` nel tuo progetto

```bash
cp -r public/* ~/Documents/rm-solution/public/
```

### 2. Copia i componenti Astro

```bash
cp src/components/Logo.astro    ~/Documents/rm-solution/src/components/
cp src/components/Header.astro  ~/Documents/rm-solution/src/components/
cp src/components/Footer.astro  ~/Documents/rm-solution/src/components/
cp src/layouts/BaseLayout.astro ~/Documents/rm-solution/src/layouts/
```

> ⚠️ **Se hai già un Header.astro e Footer.astro personalizzati**, non sovrascrivere.
> Invece, apri i file nuovi e copia solo la sezione logo (vedi sezione sotto).

---

## Se vuoi integrare solo il logo in file già esistenti

### Nel tuo `Header.astro`

Aggiungi in cima nel frontmatter (`---`):
```astro
import Logo from './Logo.astro';
```

Poi sostituisci il vecchio logo (immagine o testo) con:
```astro
<a href="/" class="logo-link" aria-label="RM-Solution — homepage">
  <Logo variant="dark" height={44} />
</a>
```

### Nel tuo `Footer.astro`

Stessa import, poi:
```astro
<a href="/" class="footer-logo-link" aria-label="RM-Solution homepage">
  <Logo variant="light" height={36} />
</a>
```

### Nel tuo `BaseLayout.astro`

Aggiungi dentro `<head>` (sostituisci il vecchio favicon se presente):

```html
<!-- Favicon -->
<link rel="icon" type="image/x-icon"  href="/favicon.ico" />
<link rel="icon" type="image/svg+xml" href="/logo.svg" />
<link rel="apple-touch-icon"          href="/favicon-512.png" />

<!-- OG Image -->
<meta property="og:image"        content="https://www.rm-solution.it/og-image.png" />
<meta property="og:image:width"  content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt"    content="RM-Solution — Marco Regalia IT Consulting" />
```

---

## Colori del brand

| Nome    | Hex       | Uso                                  |
|---------|-----------|--------------------------------------|
| Navy    | `#1b1c30` | R, sfondi scuri, testi titoli        |
| Blue    | `#3a6fb5` | M, SOLUTION, accenti, link, CTA      |
| Blue Lt | `#7aabde` | Testi su sfondo scuro, hover states  |

---

## Dopo il deploy — verifica OG Image

1. Vai su [opengraph.xyz](https://www.opengraph.xyz) e incolla `https://www.rm-solution.it`
2. Dovresti vedere il banner navy con il logo e la tagline
3. Testa anche con il [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) e [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

Se l'immagine non si aggiorna subito, clicca "Scrape Again" — i social fanno cache.

---

## Aggiornamento futuro del logo

Se il logo cambia:
1. Sostituisci `public/logo.png` con la nuova versione trasparente
2. Aggiorna `src/components/Logo.astro` (SVG inline) se la forma cambia
3. Rigenera `public/og-image.png` (puoi riutilizzare lo script Python già usato)
4. Push → Cloudflare deploya automaticamente
