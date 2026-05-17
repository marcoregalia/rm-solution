---
title: "Migrazione Exchange on-premise verso Microsoft 365 senza interruzioni operative"
settore: "Studio legale"
dimensione: "25 utenti"
risultato: "— zero downtime"
durata: "6 settimane · 3 fasi"
pubDate: 2025-09-15
draft: false
---

## Il contesto

Lo studio gestiva la propria posta su un Exchange Server 2016 ospitato in un piccolo data center
locale. La sicurezza era affidata a un antispam datato, le mailbox erano cresciute oltre i 50 GB
ciascuna, e il backup era saltato silenziosamente per oltre due settimane prima che ce ne accorgessimo
durante un audit preliminare.

L'obiettivo era duplice: passare a Microsoft 365 mantenendo lo stesso livello di riservatezza
imposto dal settore legale, e farlo senza interruzioni operative — perché in uno studio legale
una mail persa può significare un termine di legge mancato.

## L'approccio

Ho impostato il progetto in tre fasi sequenziali, distribuite su sei settimane:

1. **Configurazione ibrida iniziale.** Ho stabilito una coesistenza Exchange on-premise / Exchange Online,
   in modo che le due piattaforme si parlassero come un unico sistema. Nessun utente ha notato
   il cambiamento.
2. **Migrazione progressiva delle mailbox**, a gruppi di 5 utenti alla volta, di sera, con verifica
   il giorno successivo. Tempo di migrazione medio per mailbox: 3-4 ore.
3. **Decommissioning del server on-premise**, dopo due settimane di affiancamento e verifica
   che tutto funzionasse correttamente.

## I risultati

- Zero interruzioni di servizio durante tutta la migrazione
- Implementazione contestuale di MFA su tutti gli account
- Antispam Libraesva certificato in front-end, con regole specifiche per il settore legale
- Policy DLP per prevenire l'invio accidentale di documenti riservati
- Backup nativo Microsoft 365 + backup di terze parti su Wasabi S3 con retention a 7 anni

## La lezione imparata

Le migrazioni Microsoft 365 sembrano semplici quando le presenti come slide, ma in pratica
ogni studio ha le sue eccezioni: regole di forwarding stratificate, indirizzi condivisi
non documentati, dispositivi mobili dimenticati. Il segreto è dedicare il primo terzo del
progetto al censimento, non alla migrazione vera e propria.

> Tre giorni in più di analisi all'inizio risparmiano tre settimane di problemi alla fine.
