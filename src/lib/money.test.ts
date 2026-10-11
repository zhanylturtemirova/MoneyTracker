import test from 'node:test';
import assert from 'node:assert/strict';
import { demoSummary, parseAmount, readExpenses } from './money.ts';

test('manual amounts use exact cents and accept comma or dot', () => {
  assert.equal(parseAmount('42.80'), 4280);
  assert.equal(parseAmount(' 0,29 '), 29);
  for (const input of ['0', '-2', '1e3', '2.345', '1,000.00', '', '1000001']) {
    assert.equal(parseAmount(input), null);
  }
});

test('extra spending updates balances without clamping a deficit', () => {
  const expense = { id: 'a', merchant: 'Example', cents: 90_000, date: '2026-10-11T12:00:00Z' };
  assert.deepEqual(demoSummary([expense]), { free: -10000, spent: 214000, netWorth: 3150000 });
  assert.deepEqual(demoSummary([]), { free: 80000, spent: 124000, netWorth: 3240000 });
});

test('stored demo data rejects corruption and duplicate entries', () => {
  const expense = { id: 'a', merchant: 'Example', cents: 1234, date: '2026-10-11T12:00:00Z' };
  assert.deepEqual(readExpenses(JSON.stringify([expense])), [expense]);
  assert.throws(() => readExpenses(JSON.stringify([expense, expense])));
  assert.throws(() => readExpenses('{broken'));
  assert.throws(() => readExpenses(JSON.stringify([{ ...expense, cents: -1 }])));
});
