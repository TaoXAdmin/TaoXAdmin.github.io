---
title: "Selenium em produção: design, estabilidade e execução distribuída em 5 práticas"
description: "UI confiável com Selenium: locators estáveis, Page Objects, waits explícitos, Selenium Grid e observabilidade."
locale: pt
slug: selenium-em-producao.pt
date: 2025-09-04
draft: false
---

Selenium continua sendo o **trator da UI** em stacks heterogêneas. Para brilhar no CI/CD, foque em
**design**, **estabilidade** e **execução**. Cinco práticas essenciais.

## 1. A granularidade correta

Automatize primeiro **API/contrato** e **componentes**. Reserve Selenium para **journeys críticos** e
validação **cross‑browser**. Marque cenários por criticidade.

## 2. Locators estáveis & padrões de design

Prefira **data-test-id** e **Page Object/Screenplay**. Evite XPath frágil.

```python
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class LoginPage:
    URL = "/login"
    USER = (By.CSS_SELECTOR, "[data-test-id='user']")
    PASS = (By.CSS_SELECTOR, "[data-test-id='pass']")
    SUBMIT = (By.CSS_SELECTOR, "[data-test-id='submit']")
    def __init__(self, driver, base_url):
        self.driver = driver; self.base_url = base_url
    def open(self): self.driver.get(self.base_url + self.URL)
    def login(self, user, pwd):
        WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located(self.USER)).send_keys(user)
        self.driver.find_element(*self.PASS).send_keys(pwd)
        self.driver.find_element(*self.SUBMIT).click()
```

## 3. Waits explícitos e controle de estado

Troque `sleep()` por **WebDriverWait** e **condições** robustas. Estabilize o estado com **fixtures de
dados** e **mocks de API** quando possível.

```python
def test_login_success(chrome, base_url):
    page = LoginPage(chrome, base_url)
    page.open()
    page.login("user@example.com", "secret")
    WebDriverWait(chrome, 5).until(EC.url_contains("/dashboard"))
```

## 4. Escala com Selenium Grid

Containerize hub e nodes e paralelize Chrome/Firefox.

```yaml
services:
  selenium-hub: { image: selenium/hub:4, ports: ["4442-4444:4442-4444"] }
  chrome:
    image: selenium/node-chrome:4
    shm_size: 2g
    depends_on: [selenium-hub]
    environment: [SE_EVENT_BUS_HOST=selenium-hub]
  firefox:
    image: selenium/node-firefox:4
    shm_size: 2g
    depends_on: [selenium-hub]
    environment: [SE_EVENT_BUS_HOST=selenium-hub]
```

Na CI, faça sharding por marcador e publique relatórios.

```yaml
- run: docker compose -f docker-compose.selenium.yml up -d
- run: pytest tests/e2e -m "smoke" -n auto --dist loadgroup --junitxml=reports/e2e.xml
```

## 5. Observabilidade e anti‑flaky

Capture **screenshots**, **vídeos** e **logs** em falhas e anexe ao relatório. Quarentene testes
flaky com marcador dedicado e corrija as causas.

```ini
[pytest]
addopts = -q --junitxml=reports/e2e.xml --maxfail=1
markers =
  smoke: journeys críticos
  flaky: precisa corrigir
```

![Selenium Grid e padrões de teste](/images/placeholder_light_gray_block.png)

Com os padrões certos, Selenium vira um **amplificador de confiança**.


