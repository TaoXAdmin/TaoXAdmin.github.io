---
title: "Azure Test Plans: structure, execute and trace quality in 5 steps"
description: "From test suites to exploratory sessions—parameters, configurations and CI/CD integration."
locale: en
slug: azure-test-plans-guide.en
date: 2025-09-04
draft: false
---

**Azure Test Plans** brings traceability and manual/exploratory execution into Azure DevOps. Five
steps to make it work for you.

## 1. Pick the right suite type

- **Static**: add cases manually.  
- **Requirement‑based**: linked to a work item (User Story/Bug).  
- **Query‑based**: powered by **WIQL**.

```txt
-- Sample WIQL (query-based suite)
SELECT [System.Id] FROM WorkItems
WHERE [System.TeamProject] = @project
  AND [System.WorkItemType] = 'User Story'
  AND [System.IterationPath] UNDER 'Web/Release 24.10'
```

## 2. Parameters, shared steps and configurations

Factor common **Shared Steps** and **Parameters** (e.g., currency). Execute across **Configurations**
(browser/OS/device) for coverage.

```txt
Parameters: currency ∈ { EUR, USD }
Shared Steps: "Sign in" (reused by 18 cases)
Configurations: Chrome Win11, Firefox Ubuntu, Safari macOS
```

## 3. Exploratory sessions with traceable bugs

Start an **exploratory testing** session, capture **notes/screenshots/videos**, and create a **Bug**
linked to the **Test Case** and the **User Story**.

## 4. CI/CD integration: publish results

Publish automated reports into Azure DevOps for a single pane of glass.

```yaml
# azure-pipelines.yml (excerpt)
steps:
  - task: UsePythonVersion@0
    inputs: { versionSpec: '3.11' }
  - script: pytest -q --junitxml=test-results/pytest.xml
  - task: PublishTestResults@2
    inputs:
      testResultsFormat: 'JUnit'
      testResultsFiles: 'test-results/*.xml'
      testRunTitle: 'Automated tests (PR)'
```

## 5. End‑to‑end traceability and analytics

Link **User Stories ⇄ Test Cases ⇄ Builds ⇄ Bugs**. Use built‑in reports (Progress, Failures,
History) to drive **release gates**.

![Azure Test Plans – suites and integration](/images/placeholder_light_gray_block.png)

Configured well, Azure Test Plans becomes your quality **source of truth**.
