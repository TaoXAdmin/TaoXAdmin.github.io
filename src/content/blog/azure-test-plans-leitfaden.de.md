---
title: "Azure Test Plans: Strukturieren, ausführen und nachverfolgen in 5 Schritten"
description: "Von Testsuiten und Parametern bis Exploratives Testen und CI/CD‑Integration."
locale: de
slug: azure-test-plans-leitfaden.de
date: 2025-09-04
draft: false
---

**Azure Test Plans** bietet Nachverfolgbarkeit sowie manuelle/explorative Ausführung in Azure DevOps.
Fünf Schritte zum produktiven Einsatz.

## 1. Den richtigen Suiten‑Typ wählen

- **Statisch**: Fälle manuell.  
- **Anforderungsbasiert**: mit Work Item verknüpft.  
- **Abfragebasiert**: über **WIQL** gespeist.

```txt
SELECT [System.Id] FROM WorkItems
WHERE [System.TeamProject] = @project
  AND [System.WorkItemType] = 'User Story'
  AND [System.IterationPath] UNDER 'Web/Release 24.10'
```

## 2. Parameter, Shared Steps und Konfigurationen

Gemeinsame **Shared Steps** & **Parameter** nutzen; über **Konfigurationen** (Browser/OS/Device)
abdecken.

```txt
Parameter: currency ∈ { EUR, USD }
Shared Steps: "Anmelden" (18x wiederverwendet)
Konfigurationen: Chrome Win11, Firefox Ubuntu, Safari macOS
```

## 3. Exploratives Testen mit nachvollziehbaren Bugs

**Explorative Sitzung** starten, **Notizen/Screenshots/Videos** erfassen, **Bug** mit **Test Case** und
**User Story** verknüpfen.

## 4. CI/CD‑Integration: Ergebnisse veröffentlichen

Automatisierte Reports in Azure DevOps veröffentlichen.

```yaml
steps:
  - task: UsePythonVersion@0
    inputs: { versionSpec: '3.11' }
  - script: pytest -q --junitxml=test-results/pytest.xml
  - task: PublishTestResults@2
    inputs:
      testResultsFormat: 'JUnit'
      testResultsFiles: 'test-results/*.xml'
      testRunTitle: 'Automatisierte Tests (PR)'
```

## 5. Ende‑zu‑Ende‑Nachverfolgbarkeit & Analytics

**User Stories ⇄ Test Cases ⇄ Builds ⇄ Bugs** verknüpfen; Berichte (Progress, Failures, History) für
**Release‑Gates** nutzen.

![Azure Test Plans – Suiten & Integration](/images/placeholder_light_gray_block.png)

Richtig konfiguriert wird Azure Test Plans zur **Single Source of Truth** für Qualität.
