// The leak checks due in the next days (90 unless given), overdue first, as CSV: for the planning.
// Only units with Maci Service have an F-log in Maci. The key needs units:read and fgas:read.
//
//   MACI_API_KEY=maci_sandbox_... node leak-checks-due.mjs 90 > leak-checks.csv
import { all, csv, get } from './maci.mjs';

const days = Number(process.argv[2] ?? 90);
const until = new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);
const today = new Date().toISOString().slice(0, 10);

const sites = new Map();
for await (const site of all('/sites')) sites.set(site.id, site.name);

const due = [];
for await (const unit of all('/units', { status: 'active' })) {
  if (!unit.premium || unit.charge_is_on_parent) continue;
  const status = await get(`/units/${unit.id}/fgas-status`);
  const next = status.next_leak_check_due_at?.slice(0, 10);
  if (!status.covered || !next || next > until) continue;
  due.push([next < today ? 'overdue' : 'due', next, sites.get(unit.site_id), unit.name, unit.public_id, status.refrigerant, status.co2e_tonnes, status.interval_months, status.last_leak_check_at]);
}

due.sort((a, b) => a[1].localeCompare(b[1]));
process.stdout.write(csv([['state', 'due', 'site', 'unit', 'maci_id', 'refrigerant', 'co2e_tonnes', 'interval_months', 'last_leak_check_at'], ...due]));
