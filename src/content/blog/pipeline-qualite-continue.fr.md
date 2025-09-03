---
title: "Pipeline de qualité continue : du commit à la prod en 5 boucles de feedback"
description: "Pour Lead QA, experts, ESN et recruteurs : concevoir une chaîne de qualité observable, du test d’impact au monitoring synthétique."
locale: fr
slug: pipeline-qualite-continue.fr
date: 2025-09-04
draft: false
---

Le but n’est pas de « faire passer la CI », mais d’obtenir le **bon signal** au **bon moment**. Cette
checklist en 5 boucles aligne feature teams, QA et Ops pour aller du commit à la prod sans surprise.

## 1. Test Impact Analysis (TIA) dès la PR

Détectez les fichiers touchés, mappez vers les scénarios et exécutez **uniquement l’impacté**.

```yaml
- name: Compute changed scope
  run: |
    git fetch origin main
    git diff --name-only origin/main...HEAD > changed.txt
- name: Run unit + component impacted
  run: npx vitest --changed
- name: Run e2e impacted
  run: npx playwright test --grep @changed
```

## 2. Quality Gates multi‑niveaux

Définissez trois portes : **pre‑merge** (rapide), **pre‑release** (exhaustive), **post‑deploy**
(synthétique). Chacune a ses seuils et *SLIs*.

```yaml
# Exemple de règles (pseudo-code)
gates:
  pre-merge:
    max-duration-min: 10
    allowed-flakes: 0
  pre-release:
    coverage-min: 80
    critical-tests: must-pass
  post-deploy:
    synthetic-uptime: ">= 99.9% sur 30j"
```

## 3. Données déterministes et fixtures réalistes

Plantez des **fixtures contractuelles** stables, injectez des données via API et *feature flags*
pour activer/désactiver les garde‑fous.

```ts
// scripts/seed.ts
await api.createUser({ role: "buyer", kyc: "valid", balance: 1000, id: "U-0001" });
await api.createOrder({ userId: "U-0001", status: "PAID", id: "O-0001" });
```

## 4. Shift‑right : surveillance active et canaris

Ajoutez des **checks synthétiques** ciblant les parcours vitaux et surveillez les **budgets d’erreur**.
Reliez chaque alerte à un test e2e correspondant pour *rejouer* le bug.

```js
// check.js (synthetic)
const res = await fetch(process.env.BASE_URL + "/health/checkout");
if (res.status !== 200) process.exit(1);
```

## 5. Boucle RH : compétences et staffing

Exposez la **matrice de compétences** (design de test, data, CI, observabilité). Les ESN s’appuient
dessus pour *staffer*. Les recruteurs détectent les **signaux forts**.

```yaml
# skills.yml
roles:
  - name: QA Lead
    must_have: [strategy, risk-based-testing, governance]
    nice_to_have: [observability, chaos, TIA]
  - name: QA Expert
    must_have: [playwright, api, test-data, ci-cd]
```

![Chaîne de qualité continue](/images/placeholder_light_gray_block.png)

Avec ces cinq boucles, la qualité devient un **flux** mesurable. Besoin d’un accompagnement pour les
gates ou la mise en place TIA ? Je peux aider (audit, coaching, staffing).
