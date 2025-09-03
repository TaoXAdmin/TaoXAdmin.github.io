---
title: "Selenium in Produktion: Design, Stabilität und verteilte Läufe in 5 Praktiken"
description: "Zuverlässige UI-Tests mit Selenium: stabile Locator, Page Objects, explizite Waits, Selenium Grid und Observability."
locale: de
slug: selenium-in-produktion.de
date: 2025-09-04
draft: false
---

Selenium bleibt das **UI-Arbeitspferd** in heterogenen Stacks. Für CI/CD-Erfolg zählen **Design**,
**Stabilität** und **Ausführung**. Fünf Praktiken machen den Unterschied.

## 1. Die richtige Granularität

Automatisieren Sie zuerst **API/Vertrag** und **Komponenten**. Nutzen Sie Selenium für **kritische
Journeys** und **Cross-Browser**-Validierung. Markieren Sie Szenarien nach Kritikalität.

## 2. Stabile Locator & Entwurfsmuster

Bevorzugen Sie **data-test-id** und **Page Object/Screenplay**. Vermeiden Sie fragile XPath.

```python
# tests/pages/login_page.py
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class LoginPage:
    URL = "/login"
    USER = (By.CSS_SELECTOR, "[data-test-id='user']")
    PASS = (By.CSS_SELECTOR, "[data-test-id='pass']")
    SUBMIT = (By.CSS_SELECTOR, "[data-test-id='submit']")
    def __init__(self, driver, base_url):
        self.driver = driver
        self.base_url = base_url
    def open(self):
        self.driver.get(self.base_url + self.URL)
    def login(self, user, pwd):
        WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located(self.USER)).send_keys(user)
        self.driver.find_element(*self.PASS).send_keys(pwd)
        self.driver.find_element(*self.SUBMIT).click()
```

## 3. Explizite Waits und Zustandskontrolle

Ersetzen Sie `sleep()` durch **WebDriverWait** und robuste **Bedingungen**. Stabilisieren Sie den
Zustand über **Daten-Fixtures** und **API-Mocks**.

```python
def test_login_success(chrome, base_url):
    page = LoginPage(chrome, base_url)
    page.open()
    page.login("user@example.com", "secret")
    WebDriverWait(chrome, 5).until(EC.url_contains("/dashboard"))
```

## 4. Skalierung mit Selenium Grid

Containerisieren Sie Hub und Nodes und parallelisieren Sie Chrome/Firefox.

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

In der CI sharden Sie per Marker und veröffentlichen Berichte.

```yaml
- run: docker compose -f docker-compose.selenium.yml up -d
- run: pytest tests/e2e -m "smoke" -n auto --dist loadgroup --junitxml=reports/e2e.xml
```

## 5. Observability & Anti-Flaky

Sammeln Sie **Screenshots**, **Videos** und **Logs** bei Fehlern. Quarantäne für flaky Tests per
Marker und Ursachenbehebung.

```ini
[pytest]
addopts = -q --junitxml=reports/e2e.xml --maxfail=1
markers = 
  smoke: kritische Journeys
  flaky: schnell zu reparieren
```

![Selenium Grid und Testmuster](/images/placeholder_light_gray_block.png)

Mit den richtigen Mustern wird Selenium zum **Vertrauensverstärker**.


