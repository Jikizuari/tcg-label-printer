import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SHEET, labelPosition, placeLabels, nextStart } from '../src/layout.js';

test('sheet holds 270 labels', () => {
	assert.equal(SHEET.columns * SHEET.rows, 270);
	assert.equal(SHEET.perSheet, 270);
});

test('label 1 is top-left, label 10 top-right, label 11 second row', () => {
	assert.deepEqual(labelPosition(1), { x: 4.3, y: 13.5 });
	const p10 = labelPosition(10);
	assert.ok(Math.abs(p10.x - (4.3 + 9 * 20.4)) < 1e-9);
	assert.equal(p10.y, 13.5);
	assert.deepEqual(labelPosition(11), { x: 4.3, y: 23.5 });
});

test('last label stays on the page', () => {
	const p = labelPosition(270);
	assert.ok(p.x + SHEET.labelWidth <= SHEET.pageWidth);
	assert.ok(p.y + SHEET.labelHeight <= SHEET.pageHeight);
});

test('applies an alignment offset', () => {
	assert.deepEqual(labelPosition(1, { x: 1, y: -0.5 }), { x: 5.3, y: 13 });
});

test('places labels starting at the given slot and spills to a new page', () => {
	const placed = placeLabels(['a', 'b', 'c'], 269);
	assert.deepEqual(placed.map((p) => [p.page, p.slot, p.item]), [
		[0, 269, 'a'],
		[0, 270, 'b'],
		[1, 1, 'c'],
	]);
});

test('next start continues after the last printed label and wraps', () => {
	assert.equal(nextStart(1, 79), 80);
	assert.equal(nextStart(80, 191), 1);
	assert.equal(nextStart(269, 3), 2);
	assert.equal(nextStart(5, 0), 5);
});
