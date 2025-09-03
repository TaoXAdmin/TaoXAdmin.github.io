---
title: "Azure Test Plans: estruturar, executar e rastrear a qualidade em 5 passos"
description: "De suites e parâmetros a sessões exploratórias e integração com CI/CD."
locale: pt
slug: azure-test-plans-guia.pt
date: 2025-09-04
draft: false
---

O **Azure Test Plans** entrega rastreabilidade e execução manual/exploratória no Azure DevOps. Cinco
passos para tirar proveito.

## 1. Escolha o tipo de suite certo

- **Estática**: casos adicionados manualmente.  
- **Baseada em requisito**: ligada a Work Item.  
- **Baseada em consulta**: via **WIQL**.

```txt
SELECT [System.Id] FROM WorkItems
WHERE [System.TeamProject] = @project
  AND [System.WorkItemType] = 'User Story'
  AND [System.IterationPath] UNDER 'Web/Release 24.10'
```

## 2. Parâmetros, passos compartilhados e configurações

Use **Shared Steps** e **Parameters**; execute em múltiplas **Configurations** (navegador/SO/dispositivo).

```txt
Parâmetros: currency ∈ { EUR, USD }
Shared Steps: "Entrar" (reutilizado por 18 casos)
Configurações: Chrome Win11, Firefox Ubuntu, Safari macOS
```

## 3. Sessões exploratórias com bugs rastreáveis

Inicie sessão **exploratória**, capture **notas/capturas/vídeos**, crie **Bug** ligado ao **Test Case**
e à **User Story**.

## 4. Integração com CI/CD: publicar resultados

Publique relatórios automatizados no Azure DevOps.

```yaml
steps:
  - task: UsePythonVersion@0
    inputs: { versionSpec: '3.11' }
  - script: pytest -q --junitxml=test-results/pytest.xml
  - task: PublishTestResults@2
    inputs:
      testResultsFormat: 'JUnit'
      testResultsFiles: 'test-results/*.xml'
      testRunTitle: 'Testes automatizados (PR)'
```

## 5. Rastreabilidade ponta‑a‑ponta e analytics

Conecte **User Stories ⇄ Test Cases ⇄ Builds ⇄ Bugs** e use relatórios (Progress, Failures, History)
para guiar **gates** de release.

![Azure Test Plans – suites e integração](/images/placeholder_light_gray_block.png)

Bem configurado, o Azure Test Plans vira sua **fonte de verdade** da qualidade.
