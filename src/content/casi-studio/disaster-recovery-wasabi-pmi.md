---
title: "Disaster recovery su Wasabi S3 con backup immutabili, sostituendo il sistema a nastro"
settore: "PMI manifatturiera"
dimensione: "80 utenti"
risultato: "— RTO sotto le 4 ore"
durata: "8 settimane"
pubDate: 2025-07-20
draft: false
---

## Il contesto

L'azienda — una manifatturiera della provincia di Varese — gestiva i backup con un sistema a
nastro che richiedeva un intervento manuale ogni notte. I tape venivano portati a casa dal
responsabile IT in una cassaforte, secondo una procedura che funzionava ma era fragile, lenta
e indigesta in caso di ripristino.

Un test di restore aveva richiesto 36 ore per riportare online un singolo server. L'azienda
voleva un RTO inferiore alle 4 ore, e l'eliminazione completa dell'infrastruttura tape.

## L'approccio

Strategia 3-2-1 progettata da zero:

- **3 copie** dei dati: produzione + backup locale veloce + backup cloud
- **2 supporti diversi**: storage locale Synology + cloud object storage
- **1 copia offsite immutabile** su Wasabi S3 con WORM (Write Once Read Many) attivato
  e retention forzata a 30 giorni

I backup vengono gestiti con Veeam Backup & Replication, con job differenziati per:
- VM critiche (RPO 1 ora)
- File server (RPO 4 ore)
- Workstation utente (RPO giornaliero)

## I test di ripristino

La parte spesso saltata. Abbiamo definito un calendario di test trimestrali documentati,
con scenari realistici:

- Q1: ripristino di una VM completa
- Q2: ripristino granulare di una mailbox Exchange
- Q3: ripristino di un file server da disastro completo
- Q4: simulazione di ransomware con ripristino da backup immutabile

Ogni test produce un report PDF con tempistiche, eventuali problemi e azioni correttive.

## I risultati

- RTO ridotto da 36 ore a meno di 4 ore per i sistemi critici
- Eliminazione completa dell'infrastruttura a nastro (e dei suoi costi di manutenzione)
- Riduzione del tempo dedicato al backup dal personale IT da ~5h/settimana a ~30 minuti
- Conformità garantita anche in caso di attacco ransomware grazie all'immutabilità

## La lezione imparata

Il backup non è un costo IT. È una polizza assicurativa che speri di non usare mai —
ma se mai dovessi, deve funzionare al primo tentativo. Per questo i test di ripristino
trimestrali non sono opzionali: sono la parte più importante dell'intera strategia.

> Se non hai testato il ripristino, non hai un backup. Hai solo la speranza di averlo.
