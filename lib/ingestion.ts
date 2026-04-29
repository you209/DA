import type { ImportMethod, SupportService } from './types';

export type ImportRecord = {
  method: ImportMethod;
  sourceName: string;
  sourceUrl: string;
  fetchedAt: string;
  services: SupportService[];
  approved: boolean;
};

export async function importFromApi(fetcher: () => Promise<SupportService[]>, sourceName: string, sourceUrl: string): Promise<ImportRecord> {
  return { method: 'api', sourceName, sourceUrl, fetchedAt: new Date().toISOString(), services: await fetcher(), approved: false };
}
export function importFromCsv(rows: SupportService[], sourceName: string, sourceUrl: string): ImportRecord {
  return { method: 'csv', sourceName, sourceUrl, fetchedAt: new Date().toISOString(), services: rows, approved: false };
}
export function importManual(services: SupportService[], sourceName = 'Admin Manual Entry'): ImportRecord {
  return { method: 'manual', sourceName, sourceUrl: 'admin://manual', fetchedAt: new Date().toISOString(), services, approved: true };
}
export function importFromApprovedPublicPage(services: SupportService[], sourceName: string, sourceUrl: string): ImportRecord {
  return { method: 'approved_scrape', sourceName, sourceUrl, fetchedAt: new Date().toISOString(), services, approved: false };
}

export function forceScrapeDevOnly(sourceName: string, sourceUrl: string): ImportRecord {
  return { method: 'approved_scrape', sourceName, sourceUrl, fetchedAt: new Date().toISOString(), services: [], approved: false };
}

export function suggestRelated(service: SupportService, pool: SupportService[], need: string) {
  const q = need.toLowerCase();
  return pool.filter((p) => p.id !== service.id && p.active).map((p) => {
    let score = 0;
    if (p.state === service.state || p.state === 'Australia-wide') score += 2;
    if (p.categories.some((c) => service.categories.includes(c))) score += 3;
    if (p.tags.some((t) => service.tags.includes(t))) score += 2;
    if (q && [p.normal_description, ...p.tags, ...p.categories].join(' ').toLowerCase().includes(q)) score += 2;
    return { p, score };
  }).filter((x) => x.score > 1).sort((a, b) => b.score - a.score).slice(0, 4).map((x) => x.p);
}
