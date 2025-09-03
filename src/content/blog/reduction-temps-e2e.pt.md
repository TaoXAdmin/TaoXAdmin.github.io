---
title: "Reduzir o tempo de execução E2E para menos de 30 minutos: CI/CD, paralelização e flake-hunting"
description: "Otimize seus testes end-to-end para rodarem em menos de meia hora por meio de pipelines CI/CD eficientes, paralelização e caça a testes instáveis."
locale: pt
slug: reduction-temps-e2e.pt
date: 2025-02-05
draft: false
---
Suites E2E longas e instáveis são o pesadelo das equipes de desenvolvimento. Quando a execução
ultrapassa uma hora, o ciclo de feedback se estende e a tentação de pular a validação aumenta. No
entanto, com uma abordagem estruturada é possível trazer seus testes E2E para menos de 30 minutos
sem sacrificar a cobertura funcional. Este artigo descreve as alavancas que implementei em vários
clientes para acelerar os pipelines e trazer mais confiabilidade.

## 1. Medir e eliminar lentidões óbvias

Antes de otimizar, meça. Configure métricas de duração por teste e por etapa. Ferramentas como
Playwright ou Cypress produzem relatórios detalhados. Analise os 20 % de testes que consomem 80 %
do tempo. Muitas vezes, **esperas estáticas** (`waitForTimeout(5000)`) ou requisições de rede
desnecessárias tornam a suíte lenta. Substitua‑as por esperas condicionais e pré‑carregue dados via
APIs.

## 2. Otimizar o ambiente de execução

O ambiente conta tanto quanto o código. Execute seus testes em modo **headless** com tamanho de
tela mínimo. Use containers Docker leves e pré‑instale os navegadores. Em um pipeline CI/CD,
evite reconstruir a imagem a cada execução. Veja um exemplo usando uma imagem Playwright pronta:

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

O cache de `node_modules` e do navegador reduz ainda mais o tempo de instalação.

## 3. Paralelizar e shardar as suites

A paralelização é a principal alavanca para reduzir a duração. O Playwright cuida da
**distribuição dos testes** entre vários workers. Combine essa capacidade com as matrizes do seu
runner para executar shards em vários agentes. Por exemplo, com GitLab CI:

```yaml
e2e:
  parallel:
    matrix:
      - SHARD_INDEX: 1
      - SHARD_INDEX: 2
  script:
    - npx playwright test --shard=$SHARD_INDEX/2
```

Garanta que os testes estejam equilibrados para que cada shard tenha duração semelhante. Monitore
os tempos de execução nos seus pipelines e ajuste o número de shards conforme os recursos
disponíveis. Mais workers nem sempre significa melhor desempenho: muita concorrência pode saturar
seu banco de dados ou ambiente de integração.

## 4. Caçar testes flakies

Flakies alongam seus pipelines ao gerar reexecuções. Para rastreá‑los, instrumente seus testes com
traces e registre erros. O Playwright oferece uma configuração para relançar automaticamente testes
instáveis:

```json
{
  "retries": 2,
  "reporter": "html"
}
```

Analise os relatórios para identificar cenários que falham aleatoriamente. Na maioria das vezes, a
cau sa está em dados compartilhados ou operações assíncronas descontroladas. Isole o estado usando
**fixtures** e limpe o banco de dados entre execuções.

## 5. Ajustar a granularidade e a cobertura

Para atingir um tempo de execução ambicioso às vezes é preciso rever a **granularidade**. Concentre
os E2E nos fluxos críticos e deixe o restante para testes de serviços ou unitários. Uma proporção de
70 % de testes de componente para 30 % de E2E oferece um bom compromisso. Documente claramente essa
estratégia para que a equipe saiba quando adicionar um novo teste E2E.

## 6. Automatizar a análise e a visualização

Pipelines rápidos não bastam: é preciso também entender as tendências. Integre dashboards (Grafana,
Datadog) para visualizar o tempo médio de execução, a taxa de sucesso e o número de testes flakies.
Veja um exemplo de consulta Prometheus:

```promql
sum(rate(playwright_tests_duration_seconds_sum[5m])) by (status)
  /
sum(rate(playwright_tests_duration_seconds_count[5m]))
```

Ao exibir essas métricas, você detectará rapidamente regressões de performance e poderá agir antes
que os testes se tornem um gargalo.

![Gráfico de performance](/images/placeholder_light_gray_block.png)

## Conclusão

Reduzir o tempo de execução dos seus testes E2E para menos de 30 minutos não é apenas uma questão
de configuração. Trata‑se de um processo holístico que toca na escrita dos testes, na arquitetura da
sua aplicação e na sua organização. Combinando medições precisas, otimização do ambiente,
paralelização inteligente e caça aos flakies, você tornará seu pipeline rápido e confiável. E,
sobretudo, oferecerá às equipes um feedback contínuo indispensável para entregar software de
qualidade.

Se você deseja apoio para auditar e acelerar sua cadeia E2E, terei prazer em ajudar.