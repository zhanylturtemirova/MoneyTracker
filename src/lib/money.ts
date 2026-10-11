export type DemoExpense = { id: string; merchant: string; cents: number; date: string };
export const STORAGE_KEY = 'moneytracker.demo.expenses.v1';

export function parseAmount(input: string): number | null {
  const normalized = input.trim().replace(',', '.');
  if (!/^\d{1,7}(\.\d{1,2})?$/.test(normalized)) return null;
  const [whole, fraction = ''] = normalized.split('.');
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  return cents > 0 && cents <= 100_000_000 ? cents : null;
}

export function readExpenses(raw: string | null): DemoExpense[] {
  if (!raw) return [];
  const data: unknown = JSON.parse(raw);
  if (!Array.isArray(data) || data.length > 1000) throw new Error('Invalid demo data');
  const ids = new Set<string>();
  for (const entry of data) {
    if (!entry || typeof entry !== 'object' || typeof entry.id !== 'string' ||
      ids.has(entry.id) || typeof entry.merchant !== 'string' || !entry.merchant.trim() ||
      entry.merchant.length > 60 || !Number.isSafeInteger(entry.cents) ||
      entry.cents <= 0 || entry.cents > 100_000_000 || typeof entry.date !== 'string' ||
      !Number.isFinite(Date.parse(entry.date))) throw new Error('Invalid demo data');
    ids.add(entry.id);
  }
  return data as DemoExpense[];
}

// This preview records only extra, unplanned expenses against a fixed sample month.
// Existing budget reservations remain unchanged. It is not the production ledger.
export function demoSummary(expenses: DemoExpense[]) {
  const extra = expenses.reduce((sum, item) => sum + item.cents, 0);
  return { free: 80_000 - extra, spent: 124_000 + extra, netWorth: 3_240_000 - extra };
}

export function usd(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}
