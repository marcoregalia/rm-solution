# Setup Form Contatti — Cloudflare Function + Resend

Questo file documenta la configurazione del form di contatto del sito.
**Non è necessario riconfigurare nulla** dopo il primo setup — è qui solo come
riferimento futuro.

---

## Architettura

```
form HTML → POST /api/contact → Cloudflare Function → Resend API → info@rm-solution.it
```

I file coinvolti:

- `functions/api/contact.ts` — Cloudflare Pages Function (logica server)
- `src/pages/contatti.astro` — pagina con il form HTML
- `src/pages/contatti/grazie.astro` — pagina di ringraziamento post-invio

---

## Configurazione iniziale (UNA TANTUM)

### 1. Verifica dominio Resend

Fatto: `rm-solution.it` è verificato su Resend con 3 record DNS
(`resend._domainkey`, `send` MX, `send` SPF) tutti su sottodominio dedicato.
Non interferisce con Microsoft 365.

### 2. Environment variables su Cloudflare Pages

Sul dashboard Cloudflare → progetto `rm-solution` → **Settings** → **Variables and Secrets**,
sono state aggiunte 3 variabili al **production environment**:

| Nome variabile | Tipo | Valore |
|---|---|---|
| `RESEND_API_KEY` | **Secret** (encrypted) | re_*** (dal pannello Resend → API Keys) |
| `CONTACT_TO_EMAIL` | Plain text | `info@rm-solution.it` |
| `CONTACT_FROM_EMAIL` | Plain text | `noreply@send.rm-solution.it` |

> ⚠️ **Importante**: `RESEND_API_KEY` deve essere impostata come **Secret** (cifrata),
> non come plain text. Cloudflare la cifra e la rende invisibile dopo il salvataggio.

### 3. Build e deploy

Il file `functions/api/contact.ts` è una **Pages Function**: Cloudflare la riconosce
automaticamente al deploy e la espone come endpoint `https://rm-solution.it/api/contact`.

Non richiede configurazioni in `astro.config.mjs` né nel `package.json`.

---

## Test post-deploy

Dopo il primo deploy:

1. Vai su `https://rm-solution.it/contatti/`
2. Compila il form con dati reali (puoi inviare a te stesso)
3. Click "Invia richiesta"
4. Dovresti essere reindirizzato a `/contatti/grazie/`
5. Controlla la inbox `info@rm-solution.it` — dovrebbe arrivare l'email
6. Su Resend dashboard → **Logs**, vedrai la chiamata API andata a buon fine

## Anti-spam integrato

Il form include un campo **honeypot** invisibile chiamato `website`:
- Gli utenti umani non lo vedono e lo lasciano vuoto
- I bot lo compilano automaticamente
- La function ignora silenziosamente le submission con honeypot compilato
- Il bot pensa di aver inviato con successo e non riprova

---

## Limiti del piano Resend Free

- **3.000 email/mese** (~100 al giorno)
- **100 email/giorno**
- Un solo dominio verificato
- Logs disponibili per 1 settimana

Più che sufficiente per un sito vetrina di un consulente.
Per superare i limiti, piano a pagamento parte da $20/mese.

---

## Troubleshooting

### Il form non invia (errore generico)
- Controlla i logs della Function su Cloudflare → progetto → **Functions** → **Logs**
- Cerca errori 500 o messaggi tipo "Missing environment variables"

### L'email non arriva
- Verifica Resend dashboard → **Logs** se la chiamata è stata fatta
- Controlla la cartella spam di `info@rm-solution.it`
- Verifica che il dominio sia ancora "Verified" su Resend

### Il bot spam riesce a passare
- Aumenta la complessità del honeypot
- Aggiungi rate limiting con Cloudflare WAF (gratis)
- Considera l'aggiunta di Cloudflare Turnstile (captcha invisibile, gratis)

---

## Costi

- **Resend Free**: 0€/mese fino a 3.000 email/mese
- **Cloudflare Pages Functions Free**: 0€/mese fino a 100.000 richieste/giorno
- **Costo totale per il form**: 0€/mese

---

## Riferimenti

- [Resend Documentation](https://resend.com/docs)
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/)
- [Resend Node API](https://resend.com/docs/api-reference/emails/send-email)
