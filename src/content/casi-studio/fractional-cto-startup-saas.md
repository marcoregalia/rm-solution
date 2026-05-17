---
title: "Architettura cloud da zero, dalla scelta dei vendor alla messa in produzione"
settore: "Startup SaaS"
dimensione: "15 dipendenti"
risultato: "— Fractional CTO, 6 mesi"
durata: "6 mesi · 1 giorno/settimana"
pubDate: 2025-04-10
draft: false
---

## Il contesto

Una startup B2B nel settore HR, con un MVP funzionante e un round di seed appena chiuso. Il team
era composto da due fondatori (uno tecnico, uno commerciale), tre sviluppatori senior e
nessuna figura dedicata all'infrastruttura. La piattaforma girava su un server unico, senza
backup automatici, senza policy di sicurezza scritte, senza separazione tra ambienti di
sviluppo e produzione.

I fondatori sapevano di dover fare un salto, ma non avevano ancora il budget — né il volume di
lavoro — per assumere un CTO senior a tempo pieno. Da qui l'ingaggio in modalità Fractional:
una giornata a settimana per sei mesi.

## L'approccio

Mese 1 — **Audit e roadmap**. Censimento dell'esistente, identificazione dei rischi
prioritari, definizione di una roadmap a tre fasi (immediata, 90 giorni, 12 mesi).

Mese 2-3 — **Stack e vendor**. Selezione dello stack su Microsoft Azure: App Services per
l'applicazione, Azure SQL per il database, Azure Storage per i file utente, Azure Key Vault
per i segreti. Trattativa diretta con Microsoft Italia per attivare i crediti startup
(Microsoft for Startups).

Mese 3-4 — **Implementazione di base**. Setup degli ambienti separati (dev, staging, prod),
configurazione del primo CI/CD essenziale via GitHub Actions, implementazione di backup
automatici con retention di 30 giorni, attivazione di MFA per tutti i membri del team.

Mese 4-6 — **Policy e formazione**. Redazione di policy minime ma reali su gestione delle
credenziali, accesso ai dati dei clienti, gestione degli incidenti. Affiancamento del
lead developer nel ruolo di referente IT interno.

## La filosofia

Per una startup di questa dimensione, la trappola classica è "fare le cose in grande" troppo
presto: Kubernetes, microservizi, observability stack complessi. Costa tempo, costa soldi
e — soprattutto — distrae dal product-market fit.

L'approccio è stato deliberatamente minimalista: usare i servizi gestiti più semplici
disponibili, automatizzare solo ciò che fa risparmiare tempo dimostrabile, scrivere policy
che il team possa effettivamente seguire (non documenti da 80 pagine archiviati in Drive
e mai più letti).

## I risultati

- Infrastruttura cloud ben separata, scalabile, con costi prevedibili (~€800/mese per la fase attuale)
- Pipeline CI/CD funzionante con deploy automatici su ogni merge in main
- Backup giornalieri con test di ripristino mensili
- Audit di sicurezza superato come parte del processo di vendita a un cliente Enterprise
- Lead developer formato per gestire l'operatività in autonomia

## La transizione

Dopo i sei mesi, l'azienda non ha avuto bisogno di assumere un CTO full-time. Il Fractional CTO
si è ridotto a una giornata al mese di "sanity check", e il lead developer ha preso in carico
le responsabilità operative quotidiane. Un anno dopo, quando la startup è cresciuta a 35 persone,
hanno assunto un Head of Engineering — esattamente al momento giusto.

> Il ruolo del Fractional CTO non è restare. È costruire le condizioni per non essere più necessario.
