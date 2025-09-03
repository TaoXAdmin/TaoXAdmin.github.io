---
title: "Pytest à grande échelle : fixtures, marquage et parallélisation en 5 patterns"
description: "De la structuration du repo aux fixtures composables, en passant par le marquage, la paramétrisation et l’exécution parallèle avec xdist."
locale: fr
slug: pytest-a-grande-echelle.fr
date: 2025-09-04
draft: false
---

Pytest brille par sa **composition**. Pour passer de quelques tests à des milliers, capitalisez sur
ces 5 patterns.

## 1. Convention de projet et hiérarchie claire

Séparez `tests/unit`, `tests/api`, `tests/e2e`. Centralisez les fixtures communes dans `conftest.py`,
documentez les **marqueurs** et **niveaux** dans `pytest.ini`.

```ini
# pytest.ini
[pytest]
testpaths = tests
addopts = -ra -q
markers =
  unit: tests rapides
  api: contrat et intégration légère
  e2e: bout-en-bout critique
```

## 2. Fixtures composables (scopes & yield)

Utilisez `scope="session"` pour les ressources coûteuses, `yield` pour nettoyer proprement.

```python
# conftest.py
import pytest
from selenium import webdriver

@pytest.fixture(scope="session")
def base_url():
    return "https://app.local"

@pytest.fixture(scope="function")
def chrome():
    driver = webdriver.Chrome()
    yield driver
    driver.quit()
```

## 3. Marquage et sélecteurs puissants

Exécutez des sous-ensembles via `-m` et adaptez les pipelines (ex : `-m "unit or api"` en PR).

```bash
pytest -m "unit" -n auto
pytest -m "e2e and not flaky" --maxfail=1
```

## 4. Paramétrisation & data-driven testing

Générez des cas avec `@pytest.mark.parametrize` et des `ids` parlants.

```python
import pytest

@pytest.mark.parametrize("amount,currency,expected", [
    (0, "EUR", 0),
    (100, "EUR", 120),
], ids=["zero-eur","hundred-eur"])
def test_vat(amount, currency, expected):
    assert compute_vat(amount, currency) == expected
```

## 5. Parallélisation, robustesse et reporting

Activez `pytest-xdist` (`-n auto`), `pytest-rerunfailures` pour **réduire le bruit**, exportez en
**JUnit XML** et publiez les artefacts.

```yaml
# .github/workflows/tests.yml (extrait)
- run: pip install -U pytest pytest-xdist pytest-rerunfailures
- run: pytest -n auto --reruns 2 --junitxml=reports/pytest.xml
```

![Chaîne Pytest et exécution](/images/placeholder_light_gray_block.png)

Pytest reste **léger** mais **scalable** : le secret est dans la convention et la discipline.


