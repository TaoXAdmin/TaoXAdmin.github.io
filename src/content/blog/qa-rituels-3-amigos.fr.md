---
title: "Mettre la QA au cœur des rituels d’équipe : 3 Amigos, DoR/DoD et boucles de feedback"
description: "Comment ancrer la qualité dans les rituels (3 Amigos, refinement, planning, daily, review/retro) pour accélérer sans casser."
locale: fr
slug: qa-rituels-3-amigos.fr
date: 2025-09-04
draft: false
---

La qualité ne « se rajoute » pas en fin de sprint : elle se **construit** dans les **rituels**. Voici
5 pratiques pour faire des 3 Amigos et des cérémonies un levier de vitesse **et** de fiabilité.

## 1. 3 Amigos efficaces = critères clairs + exemples concrets

Co-construisez les critères d’acceptation avec **exemples exécutables**. Visez 20–40 min par user
story, focus sur le **risque**.

```gherkin
@checkout @critical
Fonctionnalité: Remise fidélité
  Règle: La remise s'applique après taxes
  Scénario Esquisse: Afficher le total avec remise
    Étant donné un panier de <montant> € TTC
    Quand j'applique une remise de <remise>%
    Alors le total affiché est <total> €
  Exemples:
    | montant | remise | total |
    | 100     | 10     | 90    |
    | 200     | 5      | 190   |
```

**Livrables** : critères d’acceptation, *examples* en Gherkin ou tests de composants, note de risque.

## 2. Definition of Ready/Done orientées qualité

Ajoutez des **gates** simples dans vos templates.

```md
<!-- .github/PULL_REQUEST_TEMPLATE.md -->
### Definition of Ready
- [ ] Critères d’acceptation clairs et testables
- [ ] Données de test identifiées (ou seed)
- [ ] Impact tests (unit/component/e2e) noté

### Definition of Done
- [ ] Tests automatisés verts (unit+component)
- [ ] E2E critiques taggés @smoke passés
- [ ] Logs/metrics ajoutés si nécessaire
```

## 3. Planning & Daily : orchestrer par risque et signal

Au **planning**, découpez pour exécuter tôt les **parcours vitaux**. Au **daily**, exposez le *signal* :
tests rouges, flaky, dettes. Décidez **qui débloque quoi** avant de coder plus.

## 4. Review & Demo : preuve par le test

Montrez le **changement protégé** : capture du rapport, *screen recording*, tests de contrat. Reliez
chaque démonstration à un **exemple** issu des 3 Amigos.

```txt
Demo script (5 min)
1) Contexte & risque
2) Exemple 3 Amigos -> test composant
3) Rapport CI (lien) : suites passées, temps, flaky=0
4) Prochaines garanties (synthetic check)
```

## 5. Retro : anti‑flaky et amélioration continue

Traquez les sources de flakiness (données, attentes, environnements) et fixez une **expérimentation**
par sprint (ex : données éphémères, TIA en PR).

![Rituels et boucles QA](/images/placeholder_light_gray_block.png)

En ancrant la QA dans les rituels, vous **réduisez le coût de la découverte** et accélérez la
livraison.
