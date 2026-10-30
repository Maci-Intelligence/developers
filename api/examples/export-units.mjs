// Every unit the key can reach, with its site, as CSV: for an asset register in a CAFM or ERP system.
//
//   MACI_API_KEY=maci_sandbox_... node export-units.mjs > units.csv
import { all, csv } from './maci.mjs';

const sites = new Map();
for await (const site of all('/sites')) sites.set(site.id, site.name);

const rows = [['maci_id', 'name', 'site', 'category', 'status', 'manufacturer', 'model', 'serial_no', 'refrigerant', 'charge_kg', 'co2e_tonnes', 'updated_at']];
for await (const unit of all('/units')) {
  rows.push([unit.public_id, unit.name, sites.get(unit.site_id), unit.category, unit.status, unit.manufacturer, unit.model, unit.serial_no, unit.refrigerant, unit.charge_kg, unit.co2e_tonnes, unit.updated_at]);
}

process.stdout.write(csv(rows));
