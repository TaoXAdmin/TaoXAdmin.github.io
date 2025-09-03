
---
title: "Grafana pour la QA : observabilité des tests, SLO et débogage multi‑couches en 5 usages"
description: "Relier métriques, logs et traces aux campagnes de tests pour accélérer l’analyse des échecs et piloter les gates de release."
locale: fr
slug: valeur-grafana-qa.fr
date: 2025-09-04
draft: false
---

**Grafana** apporte une **vue corrélée** des tests : métriques (Prometheus), logs (Loki) et traces
(Tempo). Voici 5 usages concrets pour la QA.

## 1. Métriques de campagne et time‑to‑signal

Exposez `tests_total`, `tests_failed`, `duration_seconds` via **Prometheus** ou **Pushgateway** et
suivez le *time‑to‑signal* (p95).

```python
# push_metrics.py
from prometheus_client import CollectorRegistry, Gauge, push_to_gateway
r=CollectorRegistry()
g=Gauge('qa_tests_failed','failed tests',['suite','build'], registry=r)
g.labels('e2e','{build}').set(3)
push_to_gateway('http://pushgateway:9091', job='qa-ci', registry=r)
```

**PromQL** : `sum(qa_tests_failed{suite="e2e"}) by (build)`

## 2. Chasse au flaky

Tracez le **taux de retries** et la **variabilité** de durée par test.

```promql
rate(qa_test_retries_total[7d]) by (test_id)
quantile_over_time(0.95, qa_test_duration_seconds{test_id=~".*checkout.*"}[14d])
```

## 3. Logs corrélés (Loki) et contextes d’échec

Logguez avec des **labels** `build`, `suite`, `test_id`. Un clic depuis le dashboard ouvre le log
filtré.

```log
ts=... level=error build={SHA} suite=e2e test_id=checkout_should_pay msg="expected 200 got 500"
```

**LogQL** : `{suite="e2e",test_id="checkout_should_pay"} |= "error"`

## 4. Traces distribuées pour les E2E

Capturez un **trace_id** côté test et propagez‑le (header). Dans Grafana, suivez la requête à travers
API/DB.

```python
# test attaches trace header
headers={"x-trace-id": trace_id()}
res = client.get("/checkout", headers=headers)
```

## 5. Dashboards, alertes et annotations

Créez un dashboard **QA** (panels: taux d’échec, p95 durée, flaky top N). **Annotations** de déploiement
et **Alerting** pour gates.

```yaml
# prometheus rule (extrait)
groups:
- name: qa
  rules:
  - alert: HighE2EFailureRate
    expr: sum(rate(qa_tests_failed[15m])) / sum(rate(qa_tests_total[15m])) > 0.05
    for: 10m
    labels: { severity: "warning" }
```

![Grafana dashboards for QA](/images/placeholder_light_gray_block.png)

Avec Grafana, les tests deviennent **observables** et les décisions de release **objectivées**.
