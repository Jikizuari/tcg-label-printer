export const MIN_PRICE = 0.5;

/**
 * Round a price to the nearest half euro (x.25 and x.75 round up), with a floor of 0.50.
 * Works in whole cents first so floating point noise (1.2499999) cannot flip the result.
 */
export function roundPrice(price) {
	const cents = Math.round(Number(price) * 100);
	const halves = Math.round(cents / 50);
	return Math.max(MIN_PRICE, halves / 2);
}

export function formatPrice(price) {
	return price.toFixed(2).replace('.', ',');
}
