
---
title: "Génération par IA des jeux de données de test : couverture, confidentialité et CI/CD en 5 étapes"
description: "Méthodes hybrides (règles + IA), validation, anonymisation et intégration pipeline pour des données de test robustes et sûres."
locale: fr
slug: ia-generation-donnees-test.fr
date: 2025-09-04
draft: false
---

La génération **assistée par IA** de jeux de données permet d’augmenter la **couverture** (cas rares,
valeurs extrêmes) tout en réduisant le coût de préparation. Voici 5 étapes pour obtenir des données
**utiles, reproductibles et conformes**.

## 1. Définir le contrat de données et le risque

Cartographiez **schémas**, **contraintes** (unicité, formats, FK) et **risques métier** (plafonds,
seuils). Décidez où l’IA apporte de la valeur : **variantes réalistes**, **langues**, **fuzz**.

```yaml
# data-contract.yaml (extrait)
entities:
  Customer:
    fields:
      - id: string(uuid) unique
      - email: string(email) unique
      - country: enum[FR,DE,PT,GB,US]
      - birthdate: date(>=1950-01-01,<=2007-12-31)
  Order:
    fields:
      - id: string(uuid) unique
      - customer_id: fk(Customer.id)
      - total_eur: number(>=0,<=99999,2dec)
      - status: enum[PAID,PENDING,FAILED,REFUNDED]
```

## 2. Stratégie hybride : règles + IA

Combinez **générateurs déterministes** (Faker, règles) et **IA** pour couvrir les coins (adresses,
noms, descriptions produits, variations linguistiques). Encadrez l’IA par **prompts contraints**.

```txt
SYSTEM: Tu génères des lignes JSON conformes au schéma ci-dessous.
Règles: pas de données réelles, valeurs plausibles, formats stricts, langue=fr.
Schéma: Customer(email, country ∈ {FR,DE,PT,GB,US}, birthdate 1950–2007)
Rends 50 lignes valides.
```

## 3. Valider qualité et cohérence

Vérifiez **schéma, intégrité référentielle, distributions** (moyennes, percentiles) et **oracles
métier** (ex: total_eur >= 0).

```python
# validate_dataset.py
import json, statistics, uuid
from typing import List, Dict

def is_uuid(x): 
    try: uuid.UUID(x); return True
    except: return False

def validate(rows: List[Dict]):
    emails=set(); ids=set()
    totals = []
    for r in rows:
        assert is_uuid(r["id"])
        assert r["email"] not in emails and "@" in r["email"]
        emails.add(r["email"]); ids.add(r["id"])
        assert r["country"] in ["FR","DE","PT","GB","US"]
        assert r["total_eur"] >= 0
        totals.append(r["total_eur"])
    p95 = sorted(totals)[int(0.95*len(totals))-1]
    return { "rows": len(rows), "p95_total": p95 }

data = [json.loads(line) for line in open("customers.jsonl")]
print(validate(data))
```

## 4. Confidentialité : synthétique ≠ anonymisé

Ne partez **jamais** de données réelles brutes. Préférez **données synthétiques** ou **masquage fort**
(hash/perturbation). Évitez la **ré‑identification** : pas d’exemples mémorisés, **bornes** strictes,
et, si nécessaire, **bruit** (*differential privacy*). Documentez la **preuve d’origine**.

## 5. Intégration CI/CD et traçabilité

Versionnez le **seed** et les **prompts**, produisez des **artefacts** (CSV/JSONL) et **labels** (commit,
schéma). Séparez **échantillons rapides** (PR) et **volumes** (nightly).

```yaml
# .github/workflows/test-data.yml (extrait)
jobs:
  gen-test-data:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install faker
      - name: Generate synthetic samples
        run: python scripts/generate_synthetic.py --seed ${{ github.sha }} --n 1000 -o artifacts/data.jsonl
      - name: Publish artifact
        uses: actions/upload-artifact@v4
        with: { name: test-data, path: artifacts/data.jsonl }
```

![Data generation pipeline](/images/placeholder_light_gray_block.png)

Bien cadrée, l’IA **augmente** vos données de test sans compromettre la **confiance**.
