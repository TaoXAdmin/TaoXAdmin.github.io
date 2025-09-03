---
title: "Pytest at scale: fixtures, marking and parallelism in 5 patterns"
description: "From repo conventions and composable fixtures to marking, parametrization and fast parallel runs with xdist."
locale: en
slug: pytest-at-scale.en
date: 2025-09-04
draft: false
---

Pytest shines through **composition**. To grow from dozens to thousands of tests, rely on these five
patterns.

## 1. Clear project convention & hierarchy

Split `tests/unit`, `tests/api`, `tests/e2e`. Centralise shared fixtures in `conftest.py`, document
**markers** and **levels** in `pytest.ini`.

```ini
# pytest.ini
[pytest]
testpaths = tests
addopts = -ra -q
markers =
  unit: fast tests
  api: contract and light integration
  e2e: end‑to‑end critical
```

## 2. Composable fixtures (scopes & yield)

Use `scope="session"` for expensive resources; use `yield` for clean teardown.

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

## 3. Markers and powerful selection

Run subsets via `-m` and tailor pipelines (e.g. `-m "unit or api"` on PRs).

```bash
pytest -m "unit" -n auto
pytest -m "e2e and not flaky" --maxfail=1
```

## 4. Parametrisation & data‑driven testing

Generate cases with `@pytest.mark.parametrize` and meaningful `ids`.

```python
import pytest

@pytest.mark.parametrize("amount,currency,expected", [
    (0, "EUR", 0),
    (100, "EUR", 120),
], ids=["zero-eur","hundred-eur"])
def test_vat(amount, currency, expected):
    assert compute_vat(amount, currency) == expected
```

## 5. Parallelism, resilience and reporting

Enable `pytest-xdist` (`-n auto`), `pytest-rerunfailures` to **reduce noise**, export **JUnit XML**,
publish artifacts.

```yaml
# .github/workflows/tests.yml (excerpt)
- run: pip install -U pytest pytest-xdist pytest-rerunfailures
- run: pytest -n auto --reruns 2 --junitxml=reports/pytest.xml
```

![Pytest chain and execution](/images/placeholder_light_gray_block.png)

Pytest stays **lightweight** yet **scalable** when backed by strong conventions.


