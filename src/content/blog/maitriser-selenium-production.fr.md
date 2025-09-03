---
title: "Dominer Selenium en production : design, stabilité et exécution distribuée en 5 pratiques"
description: "Un guide concis pour des tests UI fiables avec Selenium : locateurs stables, Page Objects, attentes explicites, Selenium Grid et observabilité."
locale: fr
slug: maitriser-selenium-production.fr
date: 2025-09-04
draft: false
---

Selenium reste la **référence UI** pour des stacks hétérogènes. Pour être efficace en continu, il faut
penser **design**, **stabilité** et **exécution** plus que « framework ». Voici 5 pratiques qui
changent tout.

## 1. Garder la bonne granularité

Automatisez d’abord **API/contrat** et **composants**. Réservez Selenium aux **parcours vitaux** et
aux validations **cross-navigateurs**. Étiquetez les scénarios par criticité pour exécuter uniquement
l’essentiel en PR.

## 2. Locateurs stables et modèles de conception

Préférez les **data-test-id** et le **Page Object / Screenplay**. Évitez les XPath fragiles.

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

## 3. Attentes explicites et contrôle de l’état

Remplacez `sleep()` par **WebDriverWait** et des **conditions** robustes. Stabilisez l’état via des
**fixtures de données** (seed), et des **mocks réseau** côté API si possible.

```python
# tests/e2e/test_login.py
def test_login_success(chrome, base_url):
    page = LoginPage(chrome, base_url)
    page.open()
    page.login("user@example.com", "secret")
    WebDriverWait(chrome, 5).until(EC.url_contains("/dashboard"))
```

## 4. Exécuter à l’échelle avec Selenium Grid

Conteneurisez hub et nœuds pour paralléliser Chrome/Firefox.

```yaml
# docker-compose.selenium.yml
services:
  selenium-hub:
    image: selenium/hub:4
    ports: ["4442-4444:4442-4444"]
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

Dans la CI, shardez les suites par marqueur.

```yaml
# .github/workflows/selenium.yml (extrait)
- run: docker compose -f docker-compose.selenium.yml up -d
- run: pytest tests/e2e -m "smoke" -n auto --dist loadgroup --junitxml=reports/e2e.xml
```

## 5. Observabilité et lutte anti-flaky

Capturez **captures**, **vidéos** et **logs** à chaque échec et joignez-les au rapport. Isolez les
tests flaky derrière un marqueur dédié et réparez les causes (données/attentes).

```ini
# pytest.ini
[pytest]
addopts = -q --junitxml=reports/e2e.xml --maxfail=1
markers =
  smoke: parcours vitaux
  flaky: à corriger rapidement
```

![Selenium Grid et patterns de test](/images/placeholder_light_gray_block.png)

Avec ces pratiques, Selenium devient un **levier** de confiance plutôt qu’un frein.


