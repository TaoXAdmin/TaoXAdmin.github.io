---
title: "Mastering Selenium at scale: design, stability and distributed runs in 5 practices"
description: "Practical Selenium for reliable UI tests: stable locators, Page Objects, explicit waits, Selenium Grid and observability."
locale: en
slug: mastering-selenium-at-scale.en
date: 2025-09-04
draft: false
---

Selenium is still the **UI workhorse** across heterogeneous stacks. To make it shine in CI/CD, focus
on **design**, **stability** and **execution**. Five practices that make the difference.

## 1. Keep the right granularity

Automate **API/contract** and **component** layers first. Reserve Selenium for **critical journeys**
and **cross-browser** validation. Tag scenarios by criticality to run only what matters on PRs.

## 2. Stable locators & design patterns

Prefer **data-test-id** and **Page Object / Screenplay**. Avoid brittle XPath.

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

## 3. Explicit waits and state control

Replace `sleep()` with **WebDriverWait** and robust **conditions**. Stabilise state via **data
fixtures** and **API mocks** where possible.

```python
# tests/e2e/test_login.py
def test_login_success(chrome, base_url):
    page = LoginPage(chrome, base_url)
    page.open()
    page.login("user@example.com", "secret")
    WebDriverWait(chrome, 5).until(EC.url_contains("/dashboard"))
```

## 4. Run at scale with Selenium Grid

Containerise hub and nodes; parallelise Chrome/Firefox.

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

In CI, shard by marker and publish reports.

```yaml
# .github/workflows/selenium.yml (excerpt)
- run: docker compose -f docker-compose.selenium.yml up -d
- run: pytest tests/e2e -m "smoke" -n auto --dist loadgroup --junitxml=reports/e2e.xml
```

## 5. Observability and anti-flakiness

Capture **screenshots**, **videos** and **logs** on failure; attach to the report. Quarantine flaky
tests behind a dedicated marker and fix root causes.

```ini
# pytest.ini
[pytest]
addopts = -q --junitxml=reports/e2e.xml --maxfail=1
markers =
  smoke: critical journeys
  flaky: needs fixing
```

![Selenium Grid and test patterns](/images/placeholder_light_gray_block.png)

With the right patterns, Selenium becomes a **confidence amplifier**.


