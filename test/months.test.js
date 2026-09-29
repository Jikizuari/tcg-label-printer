import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_COLORS, monthCode } from '../src/months.js';

test('has twelve distinct month colours', () => {
	assert.equal(DEFAULT_COLORS.length, 12);
	assert.equal(new Set(DEFAULT_COLORS.map((c) => c.hex.toLowerCase())).size, 12);
});

test('label text is only the two-digit year; the colour index carries the month', () => {
	assert.deepEqual(monthCode(new Date(2026, 8, 29)), { text: '26', index: 8 });
	assert.deepEqual(monthCode(new Date(2027, 0, 1)), { text: '27', index: 0 });
});
