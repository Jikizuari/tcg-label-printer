import { test } from 'node:test';
import assert from 'node:assert/strict';
import { roundPrice, formatPrice } from '../src/pricing.js';

test('rounds to the nearest half euro', () => {
	assert.equal(roundPrice(3.24), 3);
	assert.equal(roundPrice(3.25), 3.5);
	assert.equal(roundPrice(3.30), 3.5);
	assert.equal(roundPrice(3.74), 3.5);
	assert.equal(roundPrice(3.75), 4);
	assert.equal(roundPrice(3.82), 4);
	assert.equal(roundPrice(4.92), 5);
});

test('never goes below 0.50', () => {
	assert.equal(roundPrice(0.1), 0.5);
	assert.equal(roundPrice(0), 0.5);
	assert.equal(roundPrice(0.74), 0.5);
});

test('is not fooled by floating point noise', () => {
	assert.equal(roundPrice(1.2500000001), 1.5);
	assert.equal(roundPrice(1.2499999999), 1.5);
});

test('formats with a comma and two decimals, no currency sign', () => {
	assert.equal(formatPrice(3), '3,00');
	assert.equal(formatPrice(3.5), '3,50');
	assert.equal(formatPrice(120), '120,00');
});
