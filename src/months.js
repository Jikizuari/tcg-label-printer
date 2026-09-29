// Every month gets a different basic colour name, so no two can be confused at a glance.
export const DEFAULT_COLORS = [
	{ name: 'rood', hex: '#e30613' },
	{ name: 'oranje', hex: '#ff8a00' },
	{ name: 'geel', hex: '#ffe100' },
	{ name: 'lichtgroen', hex: '#7ed321' },
	{ name: 'donkergroen', hex: '#0a5c2b' },
	{ name: 'grijs', hex: '#9a9a9a' },
	{ name: 'lichtblauw', hex: '#00b4f0' },
	{ name: 'donkerblauw', hex: '#0b2a8a' },
	{ name: 'paars', hex: '#7b2cbf' },
	{ name: 'roze', hex: '#ff3ea5' },
	{ name: 'bruin', hex: '#7a461a' },
	{ name: 'zwart', hex: '#000000' },
];

/** The label only prints the two-digit year; the month is told by the colour at `index`. */
export function monthCode(date) {
	return { text: String(date.getFullYear()).slice(-2), index: date.getMonth() };
}
