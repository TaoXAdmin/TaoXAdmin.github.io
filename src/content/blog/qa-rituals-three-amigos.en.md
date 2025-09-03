---
title: "Putting QA at the heart of team rituals: Three Amigos, DoR/DoD and feedback loops"
description: "Make quality a team sport across rituals—Three Amigos, refinement, planning, daily, review and retro."
locale: en
slug: qa-rituals-three-amigos.en
date: 2025-09-04
draft: false
---

Quality isn’t a bolt‑on at the end of the sprint—it’s **built in** through **rituals**. Five moves to
turn Three Amigos and ceremonies into a lever for both **speed** and **reliability**.

## 1. Three Amigos that produce testable examples

Co‑create acceptance criteria with **executable examples**. Keep sessions 20–40 min per story; focus
on **risk**.

```gherkin
@checkout @critical
Feature: Loyalty discount
  Rule: Discount applies after tax
  Scenario Outline: Display total with discount
    Given a cart of <amount> € (tax included)
    When I apply a <discount>% discount
    Then the displayed total is <total> €
  Examples:
    | amount | discount | total |
    | 100    | 10       | 90    |
    | 200    | 5        | 190   |
```

Deliverables: acceptance criteria, examples (Gherkin or component tests), risk note.

## 2. Quality‑oriented Definition of Ready/Done

Add lightweight **gates** to your templates.

```md
### Definition of Ready
- [ ] Acceptance criteria are clear & testable
- [ ] Test data identified (or seed)
- [ ] Impacted tests (unit/component/e2e) noted

### Definition of Done
- [ ] Unit+component tests green
- [ ] Critical e2e (@smoke) passing
- [ ] Logs/metrics added if needed
```

## 3. Planning & Daily: schedule by risk and signal

At **planning**, slice to hit **vital journeys** early. In the **daily**, surface the **signal** (red
tests, flaky, debt) and decide **who unblocks what** before writing more code.

## 4. Review & Demo: proof through tests

Show the **protected change**: report snapshot, short screen recording, contract tests. Tie each demo
to a **Three Amigos** example.

## 5. Retro: anti‑flaky experiments

Hunt root causes (data, waits, env) and commit to one **experiment** per sprint (e.g. ephemeral test
data, PR‑level TIA).

![QA rituals and feedback loops](/images/placeholder_light_gray_block.png)

Anchoring QA in rituals reduces the **cost of discovery** and accelerates delivery.
