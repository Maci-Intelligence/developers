// A small client for Maci's API (https://api.maci.energy/docs): the key from MACI_API_KEY, lists followed page by
// page, and the API's errors thrown with their code. Node 18 or later, no packages.
const BASE = process.env.MACI_API_BASE ?? 'https://api.maci.energy/v1';
const KEY = process.env.MACI_API_KEY;
if (!KEY) throw new Error('Set MACI_API_KEY. Start with a sandbox key (maci_sandbox_...), made in the app under API-nøgler.');

export async function get(path, query = {}) {
  const url = new URL(BASE + path);
  for (const [name, value] of Object.entries(query)) if (value != null) url.searchParams.set(name, value);

  for (let attempt = 0; ; attempt++) {
    const response = await fetch(url, { headers: { Authorization: `Bearer ${KEY}`, Accept: 'application/json' } });
    // Over the limit a minute: wait as long as the API says, then try again.
    if (response.status === 429 && attempt < 5) {
      await new Promise((resolve) => setTimeout(resolve, 1000 * Number(response.headers.get('Retry-After') ?? 10)));
      continue;
    }
    const body = await response.json();
    if (!response.ok) throw new Error(`${response.status} ${body.code}: ${body.message}`);
    return body;
  }
}

// Every item of a list, following next_cursor.
export async function* all(path, query = {}) {
  let cursor = null;
  do {
    const page = await get(path, { ...query, limit: 100, cursor });
    yield* page.data;
    cursor = page.next_cursor;
  } while (cursor);
}

export function csv(rows) {
  const cell = (value) => (value == null ? '' : /[",\n;]/.test(String(value)) ? `"${String(value).replaceAll('"', '""')}"` : String(value));
  return rows.map((row) => row.map(cell).join(',')).join('\n') + '\n';
}
