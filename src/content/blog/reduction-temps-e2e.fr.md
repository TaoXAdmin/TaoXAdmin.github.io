---
title: "Réduire votre temps d’exécution E2E sous 30 minutes : CI/CD, parallélisation et flake‑hunting"
description: "Optimisez vos tests end‑to‑end pour qu’ils s’exécutent en moins d’une demi‑heure grâce à des pipelines CI/CD performants, la parallélisation et la chasse aux tests instables."
locale: fr
slug: reduction-temps-e2e
date: 2025-02-05
---

Les suites de tests end‑to‑end longues et instables sont le cauchemar des équipes de développement.
Lorsque l’exécution dépasse une heure, la boucle de feedback s’allonge et la tentation est grande de
passer outre la validation. Pourtant, avec une démarche structurée, il est possible de ramener vos
tests E2E sous la barre des 30 minutes sans sacrifier la couverture fonctionnelle. Cet article
décrit les leviers que j’ai mis en œuvre chez plusieurs clients pour accélérer les pipelines et
apporter plus de fiabilité.

## 1. Mesurer et éliminer les lenteurs évidentes

Avant d’optimiser, mesurez. Configurez des métriques de durée par test et par étape. Les outils
comme Playwright ou Cypress produisent des rapports détaillés. Analysez les 20 % de tests qui
consomment 80 % du temps. Souvent, des **attentes statiques** (`waitForTimeout(5000)`) ou des
requêtes réseau inutiles ralentissent la suite. Remplacez‑les par des attentes conditionnelles et
préchargez les données via des API.

## 2. Optimiser l’environnement d’exécution

L’environnement compte autant que le code. Exécutez vos tests en mode **headless** avec une taille
d’écran minimale. Utilisez des containers Docker légers et préinstallez les navigateurs. Dans un
pipeline CI/CD, évitez de reconstruire l’image à chaque run. Voici un exemple d’utilisation d’une
image Playwright prête à l’emploi :

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

La mise en cache de `node_modules` et du navigateur réduit encore la durée des installations.

## 3. Paralléliser et shard les suites

La parallélisation est le levier majeur pour réduire la durée. Playwright gère la **distribution des
tests** sur plusieurs workers. Combinez cette capacité avec les matrices de votre runner pour
exécuter des shards sur plusieurs agents. Par exemple, avec GitLab CI :

```yaml
e2e:
  parallel:
    matrix:
      - SHARD_INDEX: 1
      - SHARD_INDEX: 2
  script:
    - npx playwright test --shard=$SHARD_INDEX/2
```

Veillez à équilibrer les tests pour que chaque shard ait une durée similaire. Surveillez les temps
d’exécution dans vos pipelines et ajustez le nombre de shards en fonction des ressources. Plus de
workers n’est pas toujours synonyme de performance : trop de concurrence peut saturer votre base de
données ou votre environnement d’intégration.

## 4. Chasser les tests flakies

Les flakies rallongent vos pipelines en générant des réexécutions. Pour les traquer, instrumentez
vos tests avec des traces et enregistrez les erreurs. Playwright offre une commande pour relancer
automatiquement les tests instables :

```json
{
  "retries": 2,
  "reporter": "html"
}
```

Analysez ensuite les rapports pour identifier les scénarios qui échouent aléatoirement. La plupart du
temps, la cause est liée à des données partagées ou à des opérations asynchrones non maîtrisées.
Isolez l’état de vos tests en utilisant des **fixtures** et nettoyez votre base de données entre
chaque exécution.

## 5. Adapter la granularité et la couverture

Pour atteindre un temps de run ambitieux, il faut parfois revoir la **granularité**. Concentrez les
E2E sur les parcours critiques et déléguez le reste à des tests de services ou unitaires. Un ratio de
70 % de tests de composants pour 30 % d’E2E offre un bon compromis. Documentez clairement cette
stratégie pour que l’équipe sache quand ajouter un nouveau test E2E.

## 6. Automatiser l’analyse et la visualisation

Les pipelines rapides ne suffisent pas : il faut aussi comprendre les tendances. Intégrez des
tableaux de bord (Grafana, Datadog) pour visualiser le temps moyen d’exécution, le taux de
réussite et le nombre de tests flakies. Un exemple de requête Prometheus pourrait ressembler à :

```promql
sum(rate(playwright_tests_duration_seconds_sum[5m])) by (status)
  /
sum(rate(playwright_tests_duration_seconds_count[5m]))
```

En affichant ces métriques, vous détecterez rapidement les régressions de performance et pourrez
réagir avant que les tests ne deviennent un goulot d’étranglement.

![Graphique de performance](/images/placeholder_light_gray_block.png)

## Conclusion

Réduire la durée de vos tests E2E sous 30 minutes n’est pas un simple exercice de configuration. Il
s’agit d’une démarche globale qui touche à l’écriture des tests, à l’architecture de votre
application et à votre organisation. En combinant mesures précises, optimisation de l’environnement,
parallélisation intelligente et chasse aux flakies, vous rendrez votre pipeline à la fois rapide et
fiable. Et surtout, vous offrirez à vos équipes un feedback continu indispensable pour livrer du
logiciel de qualité.

Si vous souhaitez être accompagné pour auditer et accélérer votre chaîne E2E, je me ferai un plaisir
de vous aider.