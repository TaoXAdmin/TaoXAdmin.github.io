
---
title: "Valor do Grafana para QA: observabilidade de testes, SLOs e *debug* multi‑camada em 5 usos"
description: "Correlacione métricas, logs e *traces* com execuções de teste para acelerar diagnóstico e guiar *release gates*."
locale: pt
slug: valor-do-grafana-qa.pt
date: 2025-09-04
draft: false
---

O **Grafana** entrega uma visão **correlacionada**: métricas (Prometheus), logs (Loki) e *traces*
(Tempo). Cinco usos práticos para QA.

## 1. Métricas de campanha e *time‑to‑signal*

Expose `tests_total`, `tests_failed`, `duration_seconds` e acompanhe o p95.

```python
# Exemplo Pushgateway – rotular por suite/build e enviar
```

**PromQL**: `sum(qa_tests_failed{suite="e2e"}) by (build)`

## 2. Caça ao *flaky*

Acompanhe **taxa de retry** e **variância de duração** por teste.

```promql
rate(qa_test_retries_total[7d]) by (test_id)
quantile_over_time(0.95, qa_test_duration_seconds{test_id=~".*checkout.*"}[14d])
```

## 3. Logs correlacionados com Loki

Rotule logs com `build`, `suite`, `test_id` e vincule painéis a consultas LogQL.

```log
level=error build={SHA} suite=e2e test_id=checkout_should_pay msg="expected 200 got 500"
```

## 4. *Traces* distribuídos para E2E

Propage `trace_id` do teste para serviços e inspecione *spans* no Grafana.

```python
headers={"x-trace-id": trace_id()}
client.get("/checkout", headers=headers)
```

## 5. Dashboards, alertas e anotações

Dashboard QA (taxa de falhas, p95, top‑flaky), **anotações de deploy** e **alertas** para gates.

```yaml
groups:
- name: qa
  rules:
  - alert: HighE2EFailureRate
    expr: sum(rate(qa_tests_failed[15m])) / sum(rate(qa_tests_total[15m])) > 0.05
    for: 10m
```

![Dashboards Grafana para QA](/images/placeholder_light_gray_block.png)

Com Grafana, testes viram **ativos observáveis** e releases **guiadas por dados**.
