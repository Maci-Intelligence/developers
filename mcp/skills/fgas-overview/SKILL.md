---
name: maci-fgas-overview
description: An overview of refrigerant, charge and CO2 equivalent across sites from Maci, for F-gas reporting or ESG. Use when the user asks how much refrigerant or CO2 equivalent they have, which refrigerants they use, or where data is missing.
---

# F-gas overview

Sum up the refrigerant in the user's units from Maci's MCP tools. Read only.

## Steps

1. Call `list_sites`, then `list_units` with `status: active`, following `next_cursor` until it is `null`.
2. For each unit take `refrigerant`, `charge_kg` and `co2e_tonnes`. When `charge_is_on_parent` is `true`, the charge is
   on the central system (`parent_unit_id`): count it once, on the central system, never on each unit.
3. Group by site, and within each site by refrigerant:

   | Site | Refrigerant | Units | Charge (kg) | CO2e (t) |

   Then the totals for all sites, and the same by refrigerant across sites.
4. **Gaps.** List the units without `refrigerant` or `charge_kg`, by site: the totals do not include them. Say how many.
5. **Worth knowing.** Point out refrigerants with a high GWP (for example R404A and R507A) and the units with the
   largest CO2 equivalent, without advising on replacements unless asked.

## Notes

- Use Maci's `co2e_tonnes`; do not work it out from a GWP table yourself.
- Round charge to one decimal and CO2e to one decimal. Keep units: kg and tonnes CO2e.
- Units with `status: decommissioned` are left out unless the user asks for them.
