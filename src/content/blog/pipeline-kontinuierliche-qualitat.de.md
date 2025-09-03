---
title: "Kontinuierliche Qualitäts‑Pipeline: vom Commit bis Prod in 5 Feedback‑Schleifen"
description: "Für QA‑Leads, Experten, ESN und Recruiter: eine beobachtbare Qualitätskette – von Test‑Impact bis synthetischem Monitoring."
locale: de
slug: pipeline-kontinuierliche-qualitat.de
date: 2025-09-04
draft: false
---

Ziel ist nicht „CI grün“, sondern **zum richtigen Zeitpunkt das richtige Signal**. Diese 5 Schleifen
bringen Teams sicher von Commit bis Produktion.

## 1. Test Impact Analysis in der PR

Datei‑Änderungen → Szenarien mappen und **nur Betroffenes** ausführen.

```yaml
- run: git diff --name-only origin/main...HEAD > changed.txt
- run: npx vitest --changed
- run: npx playwright test --grep @changed
```

## 2. Mehrstufige Quality Gates

Drei Tore: **pre‑merge**, **pre‑release**, **post‑deploy** – mit eigenen SLIs/Schwellen.

```yaml
gates:
  pre-merge: { max-duration-min: 10, allowed-flakes: 0 }
  pre-release: { coverage-min: 80, critical-tests: must-pass }
  post-deploy: { synthetic-uptime: ">=99.9%/30d" }
```

## 3. Deterministische Daten & realistische Fixtures

Kontrakt‑Fixtures, API‑Seeding und *feature flags* für reproduzierbare Pfade.

```ts
await api.createUser({ role: "buyer", id: "U-0001" });
await api.createOrder({ userId: "U-0001", status: "PAID" });
```

## 4. Shift‑right: synthetische Checks & Canary Releases

Jeder Alarm verweist auf einen äquivalenten E2E‑Test für schnelles Replay.

```js
const ok = (await fetch(process.env.BASE_URL + "/health/checkout")).status === 200;
process.exit(ok ? 0 : 1);
```

## 5. People‑Loop: Skill‑Matrix & Staffing

Veröffentlichen Sie die **Skill‑Matrix** – hilfreich für ESN‑Einsatz und Recruiting.

```yaml
roles:
  - name: QA Lead
    must_have: [strategie, risikobasierte-tests, governance]
  - name: QA Expert
    must_have: [playwright, api, test-daten, ci-cd]
```

![Kontinuierliche Qualitätskette](/images/placeholder_light_gray_block.png)

TIA und Gates einführen? Ich helfe bei Audit, Coaching und Staffing.
