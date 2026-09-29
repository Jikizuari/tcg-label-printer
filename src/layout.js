// Geometry of the HERMA 17.8 × 10 mm sheet (10 × 27 labels on A4), in millimetres.
export const SHEET = {
	pageWidth: 210,
	pageHeight: 297,
	columns: 10,
	rows: 27,
	perSheet: 270,
	labelWidth: 17.8,
	labelHeight: 10,
	pitchX: 20.4,
	pitchY: 10,
	marginLeft: 4.3,
	marginTop: 13.5,
};

/** Top-left corner (mm) of 1-based label slot on a sheet. */
export function labelPosition(slot, offset = { x: 0, y: 0 }) {
	const index = slot - 1;
	const column = index % SHEET.columns;
	const row = Math.floor(index / SHEET.columns);
	return {
		x: SHEET.marginLeft + column * SHEET.pitchX + offset.x,
		y: SHEET.marginTop + row * SHEET.pitchY + offset.y,
	};
}

/** Assign each item a page (0-based) and slot (1-based), starting at `start`. */
export function placeLabels(items, start) {
	return items.map((item, i) => {
		const absolute = start - 1 + i;
		return {
			item,
			page: Math.floor(absolute / SHEET.perSheet),
			slot: (absolute % SHEET.perSheet) + 1,
		};
	});
}

/** First free slot after printing `count` labels from `start`. */
export function nextStart(start, count) {
	return ((start - 1 + count) % SHEET.perSheet) + 1;
}
