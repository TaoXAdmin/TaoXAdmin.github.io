
---
title: "Grafana for QA: test observability, SLOs and cross‑layer debugging in 5 moves"
description: "Correlate metrics, logs and traces with test runs to speed up failure analysis and drive release gates."
locale: en
slug: grafana-value-for-qa.en
date: 2025-09-04
draft: false
---

**Grafana** provides a **correlated** view of tests: metrics (Prometheus), logs (Loki) and traces
(Tempo). Five concrete moves for QA.

## 1. Campaign metrics and time‑to‑signal

Expose `tests_total`, `tests_failed`, `duration_seconds`; track p95 **time‑to‑signal**.

```python
from prometheus_client import CollectorRegistry, Gauge, push_to_gateway
# ... set and push metrics labeled by suite/build
```

**PromQL**: `sum(qa_tests_failed{suite="e2e"}) by (build)`

## 2. Flakiness hunting

Chart **retry rate** and **duration variability** per test.

```promql
rate(qa_test_retries_total[7d]) by (test_id)
quantile_over_time(0.95, qa_test_duration_seconds{test_id=~".*checkout.*"}[14d])
```

## 3. Correlated logs with Loki

Label logs with `build`, `suite`, `test_id` and link panels to LogQL queries.

```log
level=error build={SHA} suite=e2e test_id=checkout_should_pay msg="expected 200 got 500"
```

## 4. Distributed traces for E2E

Propagate a `trace_id` from the test to services and inspect spans in Grafana.

```python
headers={"x-trace-id": trace_id()}
client.get("/checkout", headers=headers)
```

## 5. Dashboards, alerts and annotations

QA dashboard with failure rate, p95 duration, flaky top‑N; add **deploy annotations** and **alerts**.

```yaml
groups:
- name: qa
  rules:
  - alert: HighE2EFailureRate
    expr: sum(rate(qa_tests_failed[15m])) / sum(rate(qa_tests_total[15m])) > 0.05
    for: 10m
```

![Grafana dashboards for QA](/images/placeholder_light_gray_block.png)

Grafana turns tests into **observable assets** and releases into **data‑driven** decisions.
