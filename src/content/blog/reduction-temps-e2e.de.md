---
title: "\"Testlaufzeiten unter 30 Minuten: CI/CD, Parallelisierung und Flaky‑Hunting\""
description: "\"Optimieren Sie Ihre End‑to‑End‑Tests, um sie in weniger als einer halben Stunde auszuführen, dank effizienter CI/CD‑Pipelines, Parallelisierung und der Jagd nach instabilen Tests.\""
locale: de
slug: reduction-temps-e2e
date: 2025-02-05
---
Lange und instabile End‑to‑End‑Suiten sind der Albtraum von Entwicklungsteams. Wenn die Ausführung
mehr als eine Stunde dauert, verlängert sich die Feedback‑Schleife und die Versuchung wächst, die
Validierung zu überspringen. Mit einem strukturierten Ansatz ist es jedoch möglich, Ihre E2E‑Tests
unter die Marke von 30 Minuten zu bringen, ohne die funktionale Abdeckung zu opfern. Dieser
Artikel beschreibt die Hebel, die ich bei mehreren Kunden eingesetzt habe, um Pipelines zu
beschleunigen und die Zuverlässigkeit zu erhöhen.

## 1. Messen und offensichtliche Langsamkeit beseitigen

Vor der Optimierung steht die Messung. Richten Sie Dauer‑Metriken pro Test und Schritt ein.
Werkzeuge wie Playwright oder Cypress liefern detaillierte Berichte. Analysieren Sie die 20 % der
Tests, die 80 % der Zeit verbrauchen. Häufig bremsen **statische Wartezeiten** (`waitForTimeout(5000)`) oder unnötige Netzwerkanfragen die Suite aus. Ersetzen Sie sie durch
bedingte Wartebedingungen und laden Sie Daten über APIs vor.

## 2. Die Ausführungsumgebung optimieren

Die Umgebung ist ebenso wichtig wie der Code. Führen Sie Ihre Tests im **Headless‑Modus** mit
minimaler Bildschirmgröße aus. Verwenden Sie leichte Docker‑Container und installieren Sie die
Browser vor. Vermeiden Sie in der CI/CD‑Pipeline, das Image bei jedem Durchlauf neu zu bauen.
Hier ein Beispiel für die Verwendung eines vorgefertigten Playwright‑Images:

```yaml
jobs:
  e2e:
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:focal
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test --reporter=dot
```

Durch das Caching von `node_modules` und dem Browser verkürzt sich die Installationszeit weiter.

## 3. Parallellisieren und Shards nutzen

Parallelisierung ist der größte Hebel zur Reduzierung der Dauer. Playwright verteilt die Tests
automatisch auf mehrere Worker. Kombinieren Sie diese Fähigkeit mit den Matrizen Ihres Runners, um
Shards auf mehreren Agents auszuführen. Zum Beispiel mit GitLab CI:

```yaml
e2e:
  parallel:
    matrix:
      - SHARD_INDEX: 1
      - SHARD_INDEX: 2
  script:
    - npx playwright test --shard=$SHARD_INDEX/2
```

Stellen Sie sicher, dass die Tests so ausbalanciert sind, dass jeder Shard ähnliche Laufzeiten hat.
Überwachen Sie die Ausführungszeiten in Ihren Pipelines und passen Sie die Anzahl der Shards an
die verfügbaren Ressourcen an. Mehr Worker bedeuten nicht immer bessere Leistung: zu viel
Konkurrenz kann Ihre Datenbank oder Ihre Integrationsumgebung überlasten.

## 4. Flaky‑Tests jagen

Flakies verlängern Ihre Pipelines, weil sie erneute Ausführungen auslösen. Um sie aufzuspüren,
instrumentieren Sie Ihre Tests mit Traces und zeichnen Sie Fehler auf. Playwright bietet eine
Einstellung, um instabile Tests automatisch erneut auszuführen:

```json
{
  "retries": 2,
  "reporter": "html"
}
```

Analysieren Sie die Berichte, um Szenarien zu identifizieren, die zufällig fehlschlagen. Meistens
liegt die Ursache in gemeinsamen Daten oder unkontrollierten asynchronen Operationen. Isolieren Sie
den Zustand mithilfe von **Fixtures** und säubern Sie Ihre Datenbank zwischen den Läufen.

## 5. Granularität und Abdeckung anpassen

Um eine ehrgeizige Laufzeit zu erreichen, müssen Sie manchmal die **Granularität** überdenken.
Konzentrieren Sie sich mit den E2E‑Tests auf kritische Abläufe und überlassen Sie den Rest den
Service‑ oder Unit‑Tests. Ein Verhältnis von 70 % Komponententests zu 30 % E2E bietet einen guten
Kompromiss. Dokumentieren Sie diese Strategie klar, damit das Team weiß, wann ein neuer
End‑to‑End‑Test hinzugefügt werden sollte.

## 6. Analyse und Visualisierung automatisieren

Schnelle Pipelines reichen nicht: Sie müssen auch die Trends verstehen. Integrieren Sie Dashboards
(Grafana, Datadog), um die durchschnittliche Laufzeit, die Erfolgsrate und die Anzahl der Flakies
zu visualisieren. Hier ein Beispiel für eine Prometheus‑Abfrage:

```promql
sum(rate(playwright_tests_duration_seconds_sum[5m])) by (status)
  /
sum(rate(playwright_tests_duration_seconds_count[5m]))
```

Durch das Anzeigen dieser Metriken erkennen Sie Performance‑Regressionen schnell und können handeln,
bevor Tests zum Engpass werden.

![Performance‑Grafik](/images/placeholder_light_gray_block.png)

## Fazit

Die Reduzierung Ihrer E2E‑Laufzeit unter 30 Minuten ist kein reines Konfigurationsproblem. Es ist
ein ganzheitlicher Prozess, der Ihre Testschreibung, die Architektur Ihrer Anwendung und Ihre
Organisation betrifft. Durch die Kombination aus präzisen Messungen, Umweltoptimierung,
intelligenter Parallelisierung und Flaky‑Jagd machen Sie Ihre Pipeline sowohl schnell als auch
zuverlässig. Und vor allem bieten Sie Ihren Teams das kontinuierliche Feedback, das sie benötigen,
um qualitativ hochwertige Software zu liefern.

Wenn Sie Unterstützung bei der Überprüfung und Beschleunigung Ihrer E2E‑Kette wünschen, helfe ich
Ihnen gerne weiter.