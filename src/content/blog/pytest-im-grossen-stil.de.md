---
title: "Pytest im großen Stil: Fixtures, Markierungen und Parallelität in 5 Patterns"
description: "Von Repo-Konventionen und zusammensetzbaren Fixtures bis hin zu Markern, Parametrisierung und schnellen Parallelläufen mit xdist."
locale: de
slug: pytest-im-grossen-stil.de
date: 2025-09-04
draft: false
---

Pytest überzeugt durch **Komposition**. Für den Sprung von Dutzenden zu Tausenden Tests helfen diese
fünf Patterns.

## 1. Klare Projektkonvention & Hierarchie

Trennen Sie `tests/unit`, `tests/api`, `tests/e2e`. Gemeinsame Fixtures liegen in `conftest.py`.
Dokumentieren Sie **Marker** und **Ebenen** in `pytest.ini`.

```ini
[pytest]
testpaths = tests
addopts = -ra -q
markers =
  unit: schnelle Tests
  api: Vertrag & leichte Integration
  e2e: End‑to‑End kritisch
```

## 2. Zusammensetzbare Fixtures (Scopes & Yield)

`scope="session"` für teure Ressourcen; `yield` für sauberes Teardown.

```python
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

## 3. Marker & starke Selektion

Teilmenge per `-m` ausführen und Pipelines zuschneiden.

```bash
pytest -m "unit" -n auto
pytest -m "e2e and not flaky" --maxfail=1
```

## 4. Parametrisierung & datengetriebene Tests

Fälle mit `@pytest.mark.parametrize` und sprechenden `ids` generieren.

```python
import pytest

@pytest.mark.parametrize("amount,currency,expected", [
    (0, "EUR", 0),
    (100, "EUR", 120),
], ids=["zero-eur","hundred-eur"])
def test_vat(amount, currency, expected):
    assert compute_vat(amount, currency) == expected
```

## 5. Parallelität, Robustheit & Reporting

Aktivieren Sie `pytest-xdist` (`-n auto`), `pytest-rerunfailures`, exportieren Sie **JUnit XML** und
veröffentlichen Artefakte.

```yaml
- run: pip install -U pytest pytest-xdist pytest-rerunfailures
- run: pytest -n auto --reruns 2 --junitxml=reports/pytest.xml
```

![Pytest-Kette und Ausführung](/images/placeholder_light_gray_block.png)

Mit starken Konventionen bleibt Pytest **leicht** und **skalierbar**.


