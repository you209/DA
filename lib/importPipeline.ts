import type { SupportService } from './types';

export const requiredColumns = ['id','name','source_url','source_name','last_checked_at','verified_status','phone','website','state'];

export function validateCsvColumns(headers: string[]) {
  return requiredColumns.filter((c) => !headers.includes(c));
}

export function findDuplicates(rows: SupportService[]) {
  const seen = new Map<string, string>();
  const duplicates: Array<{existingId: string; incomingId: string}> = [];
  for (const r of rows) {
    const key = `${r.phone}|${r.website}|${r.state}`.toLowerCase();
    const existing = seen.get(key);
    if (existing) duplicates.push({ existingId: existing, incomingId: r.id });
    else seen.set(key, r.id);
  }
  return duplicates;
}
