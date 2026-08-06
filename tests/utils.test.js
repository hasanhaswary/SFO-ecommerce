import test from 'node:test';
import assert from 'node:assert/strict';
import { formatCurrency } from '../public/js/utils/formatters.js';

test('formatCurrency should format numeric amounts to ZAR string', (t) => {
  const formatted = formatCurrency(3450);
  assert.ok(formatted.includes('3'));
  assert.ok(formatted.includes('450'));
});

test('formatCurrency should handle 0 or invalid inputs gracefully', (t) => {
  assert.ok(formatCurrency(0).includes('0'));
  assert.ok(formatCurrency(null).includes('0'));
});
