/**
 * Runs inside the TCG PowerTools page (MAIN world) via chrome.scripting.executeScript,
 * so it must be fully self-contained: no imports, no outer variables.
 *
 * The listing grid is virtualised (only visible tiles exist in the DOM), so instead of
 * scraping tiles we walk up React's fiber tree from one tile to the component that holds
 * the complete `items` array for the active listing tab.
 */
export function readCards() {
	const tile = document.querySelector('.visual-article-container');
	if (!tile) {
		return { error: 'Geen kaarten gevonden. Staat de listing-pagina met kaarten open?' };
	}

	const fiberKey = Object.keys(tile).find((key) => key.startsWith('__reactFiber'));
	let fiber = fiberKey ? tile[fiberKey] : null;

	for (let depth = 0; fiber && depth < 30; depth++, fiber = fiber.return) {
		const items = fiber.memoizedProps && fiber.memoizedProps.items;
		if (!Array.isArray(items) || !items.length || !items[0] || !items[0].card) {
			continue;
		}
		return {
			cards: items.map((article) => {
				const attributes = article.attributes || [];
				const quantity = typeof article.newQuantity === 'number' ? article.newQuantity : attributes[0];
				const hasNewPrice = typeof article.newPrice === 'number';
				const condition = article.newCondition || attributes[1];
				return {
					name: article.card.name,
					set: article.card.set,
					quantity: Number(quantity) || 0,
					condition: typeof condition === 'string' ? condition : '',
					price: Number(hasNewPrice ? article.newPrice : attributes[4]),
					unpriced: !hasNewPrice || Boolean(article.failedAutopricing),
				};
			}),
		};
	}

	return { error: 'Kaartenlijst niet gevonden in de pagina. Mogelijk is TCG PowerTools gewijzigd.' };
}
