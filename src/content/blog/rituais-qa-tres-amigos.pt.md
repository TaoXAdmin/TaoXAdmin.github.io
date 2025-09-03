---
title: "QA no centro dos rituais: Três Amigos, DoR/DoD e ciclos de feedback"
description: "Qualidade como esporte de equipe em refinement, planning, daily, review e retro."
locale: pt
slug: rituais-qa-tres-amigos.pt
date: 2025-09-04
draft: false
---

Qualidade não é algo que se coloca no fim do sprint — ela é **construída** nos **rituais**. Cinco
movimentos para transformar Três Amigos e cerimônias em alavanca de **velocidade** e **confiabilidade**.

## 1. Três Amigos com exemplos testáveis

Cocriar critérios de aceitação com **exemplos executáveis** (20–40 min por história; foco em **risco**).

```gherkin
@checkout @critical
Funcionalidade: Desconto de fidelidade
  Regra: Desconto aplicado após impostos
  Esquema do Cenário: Exibir total com desconto
    Dado um carrinho de <valor> € com imposto
    Quando aplico <desconto>% de desconto
    Então o total exibido é <total> €
  Exemplos:
    | valor | desconto | total |
    | 100   | 10       | 90    |
    | 200   | 5        | 190   |
```

## 2. Definition of Ready/Done orientadas à qualidade

**Gates** leves nos templates.

```md
### Definition of Ready
- [ ] Critérios claros e testáveis
- [ ] Dados de teste identificados (ou seed)
- [ ] Impacto em testes anotado

### Definition of Done
- [ ] Unit+component verdes
- [ ] E2E críticos (@smoke) passando
- [ ] Logs/métricas adicionados (se necessário)
```

## 3. Planning & Daily: agenda por risco e sinal

No **planning**, priorize **journeys vitais** cedo. No **daily**, exponha o **sinal** (vermelho/flaky/dívida)
e combine **quem desbloqueia o quê**.

## 4. Review & Demo: prova via teste

Mostrar a **mudança protegida** com relatório, *screencast* curto e testes de contrato. Conectar cada
demo a um exemplo dos **Três Amigos**.

## 5. Retro: experimentos anti‑flaky

Atacar causas (dados, waits, ambiente) e firmar um **experimento** por sprint (ex.: dados efêmeros,
TIA na PR).

![Rituais e ciclos de QA](/images/placeholder_light_gray_block.png)

Ancorar a QA nos rituais reduz o **custo de descoberta** e acelera a entrega.
