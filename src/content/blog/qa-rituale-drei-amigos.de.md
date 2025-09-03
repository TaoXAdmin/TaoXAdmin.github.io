---
title: "QA in Team‑Ritualen verankern: Drei Amigos, DoR/DoD und Feedback‑Schleifen"
description: "Qualität als Teamsport über Three‑Amigos, Refinement, Planning, Daily, Review und Retro."
locale: de
slug: qa-rituale-drei-amigos.de
date: 2025-09-04
draft: false
---

Qualität wird nicht am Sprint‑Ende „draufgesetzt“, sie wird in **Ritualen** **gebaut**. Fünf Schritte,
um Drei Amigos & Zeremonien zu einem Hebel für **Tempo** und **Zuverlässigkeit** zu machen.

## 1. Drei Amigos mit testbaren Beispielen

Akzeptanzkriterien mit **ausführbaren Beispielen** erarbeiten; 20–40 Minuten pro Story; Fokus **Risiko**.

```gherkin
@checkout @critical
Funktion: Treuerabatt
  Regel: Rabatt gilt nach Steuern
  Szenariogrundriss: Gesamt mit Rabatt anzeigen
    Angenommen ein Warenkorb über <betrag> € (inkl. Steuer)
    Wenn ich <rabatt>% Rabatt anwende
    Dann ist die Anzeige <gesamt> €
  Beispiele:
    | betrag | rabatt | gesamt |
    | 100    | 10     | 90     |
    | 200    | 5      | 190    |
```

## 2. Quality‑orientierte Definition of Ready/Done

Leichte **Gates** in Templates verankern.

```md
### Definition of Ready
- [ ] Klar & testbar
- [ ] Testdaten identifiziert (oder Seed)
- [ ] Test‑Impact notiert

### Definition of Done
- [ ] Unit+Komponenten grün
- [ ] Kritische E2E (@smoke) grün
- [ ] Logs/Metriken ergänzt (falls nötig)
```

## 3. Planning & Daily: nach Risiko und Signal planen

Im **Planning** vitalen Journey früh priorisieren. Im **Daily** den **Signal** zeigen (rot/flaky/Debt) –
**Wer** entblockt **was**?

## 4. Review & Demo: Beweis durch Tests

**Geschützte Änderung** zeigen: Report, kurzer Screen‑Cast, Vertragstests. Jede Demo mit einem
**Drei‑Amigos**‑Beispiel verbinden.

## 5. Retro: Anti‑Flaky‑Experimente

Ursachen (Daten, Waits, Umgebungen) adressieren und pro Sprint ein **Experiment** durchführen.

![QA‑Rituale und Feedback](/images/placeholder_light_gray_block.png)

So sinken **Entdeckungskosten** und die Lieferung beschleunigt sich.
