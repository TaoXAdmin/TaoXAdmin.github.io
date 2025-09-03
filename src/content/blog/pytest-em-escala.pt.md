---
title: "Pytest em escala: fixtures, marcações e paralelismo em 5 padrões"
description: "Da convenção de repositório e fixtures compostas à marcação, parametrização e execução paralela rápida com xdist."
locale: pt
slug: pytest-em-escala.pt
date: 2025-09-04
draft: false
---

O poder do Pytest está na **composição**. Para crescer de dezenas para milhares de testes, siga estes
5 padrões.

## 1. Convenção de projeto & hierarquia

Separe `tests/unit`, `tests/api`, `tests/e2e`. Centralize fixtures comuns em `conftest.py` e
documente **marcações** e **níveis** no `pytest.ini`.

```ini
[pytest]
testpaths = tests
addopts = -ra -q
markers =
  unit: testes rápidos
  api: contrato e integração leve
  e2e: ponta‑a‑ponta crítico
```

## 2. Fixtures compostas (scopes & yield)

`scope="session"` para recursos caros; `yield` para teardown limpo.

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

## 3. Marcações e seleção poderosa

Execute subconjuntos com `-m` e ajuste pipelines (ex.: `-m "unit or api"` em PRs).

```bash
pytest -m "unit" -n auto
pytest -m "e2e and not flaky" --maxfail=1
```

## 4. Parametrização & testes orientados a dados

Gere casos com `@pytest.mark.parametrize` e `ids` descritivos.

```python
import pytest

@pytest.mark.parametrize("amount,currency,expected", [
    (0, "EUR", 0),
    (100, "EUR", 120),
], ids=["zero-eur","hundred-eur"])
def test_vat(amount, currency, expected):
    assert compute_vat(amount, currency) == expected
```

## 5. Paralelismo, resiliência e relatórios

Ative `pytest-xdist` (`-n auto`), `pytest-rerunfailures` para **reduzir ruído**, exporte **JUnit XML**
e publique artefatos.

```yaml
- run: pip install -U pytest pytest-xdist pytest-rerunfailures
- run: pytest -n auto --reruns 2 --junitxml=reports/pytest.xml
```

![Cadeia Pytest e execução](/images/placeholder_light_gray_block.png)

Com boas convenções, o Pytest permanece **leve** e **escalável**.


