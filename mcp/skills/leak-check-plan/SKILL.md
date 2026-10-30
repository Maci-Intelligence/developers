---
name: maci-leak-check-plan
description: Plan the leak checks the EU F-gas regulation asks for, from Maci. Use when the user asks which refrigeration units are due or overdue a leak check, or wants a leak check plan for a period, a site or a customer.
---

# Leak check plan

Make a plan of the leak checks due in a period, from Maci's MCP tools. Read only: never suggest changing anything in Maci.

## Steps

1. **The period.** Use the one the user gives. Without one, take the next three months from today.
2. **The units.** Call `list_units` with `status: active`, following `next_cursor` until it is `null`. If the user named
   a site, call `list_sites` first and pass its `site_id`. Skip a unit with `charge_is_on_parent: true`: its refrigerant
   is on the central system (`parent_unit_id`), which is checked instead.
3. **Their status.** For each unit with `premium: true`, call `get_fgas_status`. A unit with `premium: false` has no
   F-log in Maci: list those apart at the end, as "not tracked in Maci".
4. **Sort them out.**
   - `covered: false`: not subject to leak checks. Leave out, but count them.
   - `next_leak_check_due_at` before today: **overdue**.
   - Within the period: **due**.
   - `last_leak_check_at` is `null` and `covered: true`: **never checked in Maci**, which needs looking at.
   - `follow_up_check` set: a follow-up after a repair is due, which comes first.
5. **The answer.** A table by site, overdue first, then by due date:

   | Site | Unit | Maci-ID | Refrigerant | CO2e (t) | Interval | Last check | Due |

   Then a short summary: how many overdue, due, never checked and not tracked. Give dates as the user writes them.

## Notes

- The interval follows from the CO2 equivalent and whether a leak detection system is fitted (`interval_months`,
  `detection_system_missing`). Explain that if the user asks why a unit is checked so often.
- Do not work out intervals yourself: use what `get_fgas_status` gives.
- Many units take many calls. For more than about 50 units, say so and ask whether to go on, or start with one site.
