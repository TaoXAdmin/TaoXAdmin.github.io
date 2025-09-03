
---
title: "Mehrwert von Grafana für QA: Test‑Observability, SLOs und Cross‑Layer‑Debugging in 5 Anwendungen"
description: "Metriken, Logs und Traces mit Testruns korrelieren – schnellere Fehlersuche und Release‑Gates."
locale: de
slug: grafana-mehrwert-qa.de
date: 2025-09-04
draft: false
---

**Grafana** liefert die **korrelierte** Sicht: Metriken (Prometheus), Logs (Loki), Traces (Tempo).
Fünf Anwendungen für QA.

## 1. Kampagnenmetriken & Time‑to‑Signal

`tests_total`, `tests_failed`, `duration_seconds` exponieren und p95 **Time‑to‑Signal** verfolgen.

```python
# Pushgateway‑Beispiel – Metriken nach Suite/Build labeln
```

**PromQL**: `sum(qa_tests_failed{suite="e2e"}) by (build)`

## 2. Flaky‑Jagd

**Retry‑Rate** und **Dauer‑Varianz** pro Test plotten.

```promql
rate(qa_test_retries_total[7d]) by (test_id)
quantile_over_time(0.95, qa_test_duration_seconds{test_id=~".*checkout.*"}[14d])
```

## 3. Korrelierte Logs (Loki)

Logs mit `build`, `suite`, `test_id` labeln und via LogQL verlinken.

```log
level=error build={SHA} suite=e2e test_id=checkout_should_pay msg="expected 200 got 500"
```

## 4. Verteilte Traces für E2E

`trace_id` vom Test propagieren und Spans in Grafana analysieren.

```python
headers={"x-trace-id": trace_id()}
client.get("/checkout", headers=headers)
```

## 5. Dashboards, Alerts & Annotationen

QA‑Dashboard (Fehlerrate, p95, Top‑Flaky), **Deploy‑Annotationen**, **Alerts** für Gates.

```yaml
groups:
- name: qa
  rules:
  - alert: HighE2EFailureRate
    expr: sum(rate(qa_tests_failed[15m])) / sum(rate(qa_tests_total[15m])) > 0.05
    for: 10m
```

![Grafana‑Dashboards für QA](/images/placeholder_light_gray_block.png)

Grafana macht Tests **beobachtbar** – Releases werden **datengetrieben**.
