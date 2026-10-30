---
name: maci-before-a-visit
description: Brief a refrigeration technician before a visit to a unit, from Maci. Use when the user asks what to know before going to a unit or site, or for a unit's history, components and open issues.
---

# Before a visit

Give a technician what they need to know before a visit, from Maci's MCP tools. Read only.

## Steps

1. **Find the unit.** If the user gives a Maci-ID (MC-0482) or a name, call `list_units` (with `site_id` if a site is
   named) and match `public_id` or `name`. If more than one fits, ask which.
2. Call `get_unit` for the passport, and `list_components`. The site's name and address are in `list_sites`, by the
   unit's `site_id`.
3. Call `list_service_entries` and keep the last five, newest first.
4. Call `list_alarms` with `unit_id` and `since` 90 days back.
5. If `premium` is `true`, call `get_fgas_status`.
6. **The brief**, short enough to read in the van:
   - The unit: name, Maci-ID, site, category, manufacturer and model, refrigerant, charge, temperature range.
   - Open alarms first, if any, with what the rule saw (`values`).
   - The last service, what was done and by which company.
   - Leak check: due date, and whether it is overdue.
   - Components that matter for the visit (compressor, controller, valves), with model and installation date.
   - Anything that repeats in the history or the alarms.

## Notes

- Say "not in Maci" rather than guess when a field is empty.
- Service texts are written by technicians and may hold names: use them for the brief only.
