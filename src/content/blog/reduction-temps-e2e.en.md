---
title: "Reducing your E2E run time under 30 minutes: CI/CD, parallelisation and flake-hunting"
description: "Optimise your end-to-end tests to run in less than half an hour through efficient CI/CD pipelines, parallelisation and the hunt for flaky tests."
locale: en
slug: reduction-temps-e2e.en
date: 2025-02-05
draft: false
---
Long and unstable end‑to‑end suites are a nightmare for development teams. When execution exceeds an
hour the feedback loop stretches and the temptation to skip validation grows. Yet with a structured
approach it’s possible to bring your E2E tests below the 30‑minute mark without sacrificing
functional coverage. This article describes the levers I’ve deployed at several clients to speed up
pipelines and increase reliability.

## 1. Measure and eliminate obvious slowness

Before optimising, measure. Set up duration metrics per test and per step. Tools like Playwright or
Cypress produce detailed reports. Analyse the 20 % of tests that consume 80 % of the time. Often
**static waits** (`waitForTimeout(5000)`) or unnecessary network requests slow the suite down.
Replace them with conditional waits and preload data via APIs.

## 2. Optimise the execution environment

The environment matters as much as the code. Run your tests in **headless** mode with a minimal
screen size. Use lightweight Docker containers and preinstall the browsers. In a CI/CD pipeline
avoid rebuilding the image on every run. Here’s an example using a ready‑made Playwright image:

```yaml
jobs:
  e2e:
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:focal
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test --reporter=dot
```

Caching `node_modules` and the browser further cuts installation time.

## 3. Parallelise and shard the suites

Parallelisation is the major lever to reduce duration. Playwright handles **test distribution**
across multiple workers. Combine this capability with your runner’s matrices to run shards on
several agents. For example, with GitLab CI:

```yaml
e2e:
  parallel:
    matrix:
      - SHARD_INDEX: 1
      - SHARD_INDEX: 2
  script:
    - npx playwright test --shard=$SHARD_INDEX/2
```

Make sure to balance tests so each shard has similar run time. Monitor execution times in your
pipelines and adjust the number of shards based on available resources. More workers isn’t always
better: too much concurrency can saturate your database or integration environment.

## 4. Hunt down flaky tests

Flakies lengthen your pipelines by triggering reruns. To track them down, instrument your tests with
traces and record errors. Playwright offers a setting to automatically rerun unstable tests:

```json
{
  "retries": 2,
  "reporter": "html"
}
```

Analyse the reports to identify scenarios that fail randomly. Most of the time the cause lies in
shared data or uncontrolled asynchronous operations. Isolate state using **fixtures** and clean your
database between runs.

## 5. Adjust granularity and coverage

To hit an ambitious run time you sometimes need to rethink **granularity**. Focus E2E on critical
journeys and delegate the rest to service or unit tests. A ratio of 70 % component tests to 30 %
E2E offers a good compromise. Document this strategy clearly so the team knows when to add a new
end‑to‑end test.

## 6. Automate analysis and visualisation

Fast pipelines aren’t enough: you also need to understand trends. Integrate dashboards (Grafana,
Datadog) to visualise average run time, success rate and number of flaky tests. Here’s an example
Prometheus query:

```promql
sum(rate(playwright_tests_duration_seconds_sum[5m])) by (status)
  /
sum(rate(playwright_tests_duration_seconds_count[5m]))
```

Displaying these metrics helps you quickly detect performance regressions and act before tests become
a bottleneck.

![Performance graph](/images/placeholder_light_gray_block.png)

## Conclusion

Reducing your E2E run time under 30 minutes is not just a matter of configuration. It’s a holistic
process that touches your test writing, application architecture and organisation. By combining
precise measurements, environment optimisation, smart parallelisation and flake hunting you’ll make
your pipeline both fast and reliable. And above all, you’ll provide your teams with the continuous
feedback needed to ship quality software.

If you’d like support auditing and accelerating your E2E chain, I’d be happy to help.