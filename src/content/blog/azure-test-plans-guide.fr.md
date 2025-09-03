---
title: "Azure Test Plans : structurer, exécuter et tracer la qualité en 5 étapes"
description: "Des suites de test aux sessions exploratoires, en passant par les paramètres, configurations et intégration CI/CD."
locale: fr
slug: azure-test-plans-guide.fr
date: 2025-09-04
draft: false
---

**Azure Test Plans** offre traçabilité et exécution manuelle/exploratoire intégrées à Azure DevOps.
Voici 5 étapes pour en tirer le meilleur.

## 1. Choisir le bon type de suite

- **Statique** : ajout manuel de cas.  
- **Basée sur une exigence** : liée à un work item (User Story/Bug).  
- **Basée sur une requête** : alimentée par un **WIQL**.

```txt
-- WIQL d'exemple (query-based suite)
SELECT [System.Id] FROM WorkItems
WHERE [System.TeamProject] = @project
  AND [System.WorkItemType] = 'User Story'
  AND [System.IterationPath] UNDER 'Web/Release 24.10'
```

## 2. Paramètres, étapes partagées et configurations

Factorisez avec **Shared Steps** et **Parameters** (ex : devises). Exécutez sur plusieurs
**Configurations** (navigateur/OS/appareil) pour la couverture.

```txt
Paramètres: currency ∈ { EUR, USD }
Étapes partagées: "Se connecter" (réutilisée par 18 cas)
Configurations: Chrome Win11, Firefox Ubuntu, Safari macOS
```

## 3. Sessions exploratoires et bogues traçables

Lancez une **session exploratoire**, capturez **notes/captures/vidéos**, créez un **Bug** lié au
**Test Case** et à la **User Story** correspondante.

## 4. Intégrer la CI/CD : publier les résultats

Publiez vos rapports automatisés dans Azure DevOps pour une vue unique.

```yaml
# azure-pipelines.yml (extrait)
steps:
  - task: UsePythonVersion@0
    inputs: { versionSpec: '3.11' }
  - script: pytest -q --junitxml=test-results/pytest.xml
  - task: PublishTestResults@2
    inputs:
      testResultsFormat: 'JUnit'
      testResultsFiles: 'test-results/*.xml'
      testRunTitle: 'Tests automatisés (PR)'
```

## 5. Traçabilité bout‑en‑bout et analytics

Reliez **User Stories ⇄ Test Cases ⇄ Builds ⇄ Bugs**. Utilisez les rapports (Progression, Echecs,
Historique) pour piloter les **gates** de release.

![Azure Test Plans – suites et intégration](/images/placeholder_light_gray_block.png)

Bien configuré, Azure Test Plans devient votre **source de vérité** qualité. 
