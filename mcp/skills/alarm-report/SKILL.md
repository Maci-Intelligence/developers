---
name: maci-alarm-report
description: A report of a period's alarms from Maci Intelligence: how many, where, how fast they were taken, and how many were false. Use when the user asks for an alarm report, an SLA or response time report, or which units alarm most.
---

# Alarm report

Report on the alarms of a period from Maci's MCP tools. Read only: never offer to take or close alarms.

## Steps

1. **The period.** Use the one the user gives; without one, the last calendar month.
2. **The alarms.** Call `list_alarms` with `since` at the start of the period, following `next_cursor` until it is
   `null`. Keep the alarms whose `raised_at` falls in the period. Add `unit_id` if the user asks about one unit.
3. **Work out, for the period:**
   - The number of alarms, by `severity` (`HIGH` is an alarm, `MEDIUM` a warning, `INFO` a notice).
   - Time to take: `acknowledged_at` minus `raised_at`, as a median and the slowest. Count the ones never taken.
   - Result of the closed ones: `result` `real` or `false`, and the share of false alarms.
   - Still open at the end (`open: true`).
   - By unit and site: the units with the most alarms, and by `name` (the kind of alarm).
4. **The answer.** A short summary first (the numbers that matter), then the tables:

   | Unit | Site | Alarm | Raised | Taken after | Taken by | Result |

   Give times in the user's time zone; Maci gives UTC.

## Notes

- `acknowledged_by` and `closed_by` are names of people. Use them only as the report needs.
- An alarm's `note` is what the technician wrote. Quote it only when the user asks about a single alarm.
- `level` says how far an alarm went before someone took it: 0 the watch (or the owner without a watch), 1 the owner,
  2 Maci.
