# RM-Solution — Fix Worker (form contatti funzionante)

Questo pacchetto sostituisce il modello "Pages Functions" (che richiedeva un setup diverso)
con il modello **Worker + Static Assets** che corrisponde alla configurazione attuale del
progetto su Cloudflare.

---

## Cosa contiene il pacchetto

```
rm-solution-worker-fix/
├── src/
│   ├── index.ts                       ← NUOVO — Worker entry point
│   └── pages/
│       ├── contatti.astro             ← AGGIORNATO — form con action /api/contact
│       └── contatti/
│           └── grazie.astro           ← NUOVO — pagina di ringraziamento
├── wrangler.toml                       ← NUOVO — configurazione Worker
└── WORKER-FIX-README.md                ← questo file
```

---

## Procedura di applicazione

### Step 1 — Rimuovi i file vecchi del tentativo precedente

Sulla VM, dentro `~/Documents/rm-solution`:

```bash
cd ~/Documents/rm-solution
rm -rf functions/
rm -f FORM-SETUP.md
```

La cartella `functions/` era per il modello "Pages Functions" e qui non funziona.

### Step 2 — Estrai e copia il nuovo pacchetto

```bash
cd ~/Downloads
unzip -o rm-solution-worker-fix.zip
cp -rv rm-solution-worker-fix/src/ ~/Documents/rm-solution/
cp -v rm-solution-worker-fix/wrangler.toml ~/Documents/rm-solution/
cp -v rm-solution-worker-fix/WORKER-FIX-README.md ~/Documents/rm-solution/
```

### Step 3 — Verifica la struttura del progetto

```bash
cd ~/Documents/rm-solution
ls -la wrangler.toml src/index.ts src/pages/contatti.astro src/pages/contatti/grazie.astro
```

Deve trovare tutti e 4 i file. Se uno manca, il copy ha fallito.

### Step 4 — Test in locale (opzionale)

Astro dev server NON esegue il Worker, però puoi verificare che il form si visualizzi:

```bash
npm run dev
```

Vai su `http://localhost:4321/contatti/` — il form si vede correttamente.
**NON** puoi testare l'invio mail localmente perché serve Cloudflare runtime.

### Step 5 — Commit e push

```bash
git add src/ wrangler.toml WORKER-FIX-README.md
git rm -r functions/ 2>/dev/null || true
git rm FORM-SETUP.md 2>/dev/null || true
git commit -m "Sostituito Pages Functions con Worker + Static Assets per form contatti"
git push
```

### Step 6 — Verifica deploy su Cloudflare

Dopo il push, Cloudflare deploya in 1-2 minuti. Su dashboard → Workers & Pages → rm-solution:

1. Tab **Deployments** → l'ultimo deploy deve essere "Success"
2. Apri i **Build logs** dell'ultimo deploy
3. Cerca queste righe (devono esserci):
   - `Found Worker at src/index.ts`
   - `Uploaded ... static assets`
   - `Deployment complete!`

---

## Test funzionale

### Test 1 — Endpoint API risponde

Apri nel browser:
```
https://rm-solution.marco-59e.workers.dev/api/contact
```

- ✅ Risposta attesa: **405 Method Not Allowed** (il Worker risponde, blocca GET)
- ❌ Se vedi 404 con logo Astro: il Worker non sta gestendo il path → problema configurazione

### Test 2 — Invio form

1. Vai su `https://rm-solution.marco-59e.workers.dev/contatti/`
2. Compila il form con dati reali
3. Spunta privacy
4. Click "Invia richiesta"
5. Attesa risultato:
   - ✅ Redirect a `/contatti/grazie/` → email inviata
   - ❌ Messaggio errore rosso → controlla i log

### Test 3 — Email arrivata

1. Controlla la inbox `info@rm-solution.it` (M365)
2. Su Resend dashboard → **Logs** → vedi la chiamata API
3. L'email dovrebbe avere `Reply-To` impostato sull'email del visitatore

---

## Troubleshooting

### Errore "Server configuration error"
**Causa**: le 3 environment variables non sono configurate.
**Fix**: Cloudflare → progetto → Settings → Variables and Secrets, aggiungi:
- `RESEND_API_KEY` (Secret)
- `CONTACT_TO_EMAIL` = info@rm-solution.it
- `CONTACT_FROM_EMAIL` = noreply@send.rm-solution.it

### Errore 404 su /api/contact
**Causa**: il Worker non si è deployato correttamente, o `wrangler.toml` ha problemi.
**Fix**: controlla i Build logs su Cloudflare → cerca errori durante il build.

### Mail non arriva
1. Controlla cartella spam di info@rm-solution.it
2. Resend dashboard → Logs: la chiamata è stata fatta?
3. Verifica che il dominio sia ancora "Verified" su Resend
4. Verifica `CONTACT_FROM_EMAIL` = `noreply@send.rm-solution.it` (sottodominio, non root)

### Build fails con "wrangler config error"
Probabile typo nel `wrangler.toml`. Riscaricalo dal pacchetto e sovrascrivi.

---

## Differenze rispetto a Pages Functions

| Aspetto | Pages Functions (vecchio) | Worker + Assets (nuovo) |
|---------|---------------------------|-------------------------|
| Cartella codice | `functions/api/contact.ts` | `src/index.ts` |
| Routing | Automatico per filename | Esplicito dentro `fetch()` |
| Config file | Niente | `wrangler.toml` |
| Asset statici | Automatici | Tramite binding `ASSETS` |
| Complessità | Più alta per casi piccoli | Più flessibile e potente |

Il risultato per l'utente finale è identico: form che funziona, mail che arriva, redirect a `/grazie`.

---

## Riferimenti

- [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Wrangler Configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [Resend API Docs](https://resend.com/docs/api-reference/emails/send-email)
