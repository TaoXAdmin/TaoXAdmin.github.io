---
title: "Continuous quality pipeline: from commit to production in 5 feedback loops"
description: "For QA Leads, experts, ESNs and recruiters: design an observable quality chain, from test impact to synthetic monitoring."
locale: en
slug: continuous-quality-pipeline.en
date: 2025-09-04
draft: false
---

The goal isn’t to “make CI green” but to get the **right signal** at the **right time**. These five
loops align product teams, QA and Ops from commit to production.

## 1. Test Impact Analysis (TIA) on the PR

Map changed files to scenarios and run **only the impacted** ones.

```yaml
- run: git diff --name-only origin/main...HEAD > changed.txt
- run: npx vitest --changed
- run: npx playwright test --grep @changed
```

## 2. Layered quality gates

Define three gates: **pre‑merge** (fast), **pre‑release** (exhaustive), **post‑deploy** (synthetic).

```yaml
gates:
  pre-merge: { max-duration-min: 10, allowed-flakes: 0 }
  pre-release: { coverage-min: 80, critical-tests: must-pass }
  post-deploy: { synthetic-uptime: ">=99.9% over 30d" }
```

## 3. Deterministic data and realistic fixtures

Seed contractual fixtures, inject data via API and use feature flags to control variability.

```ts
await api.createUser({ role: "buyer", id: "U-0001" });
await api.createOrder({ userId: "U-0001", status: "PAID" });
```

## 4. Shift‑right: synthetic checks and canaries

Tie each alert to an equivalent e2e test for rapid **replay**.

```js
const ok = (await fetch(process.env.BASE_URL + "/health/checkout")).status === 200;
process.exit(ok ? 0 : 1);
```

## 5. People loop: skills matrix and staffing

Publish the **skills matrix** (test design, data, CI, observability) – useful for ESNs and recruiters.

```yaml
roles:
  - name: QA Lead
    must_have: [strategy, risk-based-testing, governance]
  - name: QA Expert
    must_have: [playwright, api, test-data, ci-cd]
```

![Continuous quality chain](/images/placeholder_light_gray_block.png)

Ready to implement TIA and gates? I can help with audits, coaching and staffing.
