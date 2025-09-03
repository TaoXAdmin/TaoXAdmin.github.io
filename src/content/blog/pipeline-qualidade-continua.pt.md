---
title: "Pipeline de qualidade contínua: do commit à produção em 5 ciclos de feedback"
description: "Para Leads, especialistas, ESN e recrutadores: desenhe uma cadeia de qualidade observável, do impacto de testes ao monitoramento sintético."
locale: pt
slug: pipeline-qualidade-continua.pt
date: 2025-09-04
draft: false
---

O objetivo não é “passar na CI”, e sim obter o **sinal certo** na **hora certa**. Estes 5 ciclos
alinhados levam o time do commit até a produção sem sustos.

## 1. Test Impact Analysis (TIA) já na PR

Mapeie arquivos alterados → cenários e execute **somente o impactado**.

```yaml
- run: git diff --name-only origin/main...HEAD > changed.txt
- run: npx vitest --changed
- run: npx playwright test --grep @changed
```

## 2. Quality Gates em camadas

Três portas: **pre‑merge**, **pre‑release**, **post‑deploy** – cada uma com seus SLIs/limiares.

```yaml
gates:
  pre-merge: { max-duration-min: 10, allowed-flakes: 0 }
  pre-release: { coverage-min: 80, critical-tests: must-pass }
  post-deploy: { synthetic-uptime: ">=99.9%/30d" }
```

## 3. Dados determinísticos e *fixtures* realistas

Semeie dados contratuais e controle variabilidade com *feature flags*.

```ts
await api.createUser({ role: "buyer", id: "U-0001" });
await api.createOrder({ userId: "U-0001", status: "PAID" });
```

## 4. Shift‑right: checagens sintéticas e canários

Relacione cada alerta a um teste e2e equivalente para *replay* do bug.

```js
const ok = (await fetch(process.env.BASE_URL + "/health/checkout")).status === 200;
process.exit(ok ? 0 : 1);
```

## 5. Pessoas: matriz de habilidades e *staffing*

Publique a matriz de skills para orientar ESNs e recrutadores.

```yaml
roles:
  - name: QA Lead
    must_have: [estratégia, testes-baseados-em-risco, governança]
  - name: QA Expert
    must_have: [playwright, api, dados-de-teste, ci-cd]
```

![Cadeia de qualidade contínua](/images/placeholder_light_gray_block.png)

Pronto para implantar TIA e gates? Posso apoiar com auditoria, coaching e staffing.
