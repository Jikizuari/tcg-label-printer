import { SHEET, labelPosition, placeLabels } from './layout.js';

function el(tag, className, text) {
	const node = document.createElement(tag);
	node.className = className;
	if (text !== undefined) {
		node.textContent = text;
	}
	return node;
}

function position(node, slot, offset) {
	const { x, y } = labelPosition(slot, offset);
	node.style.left = `${x}mm`;
	node.style.top = `${y}mm`;
	node.style.width = `${SHEET.labelWidth}mm`;
	node.style.height = `${SHEET.labelHeight}mm`;
}

function createPage(offset) {
	const page = el('section', 'page');
	// Faint outlines of every slot, only visible on screen as a preview aid.
	for (let slot = 1; slot <= SHEET.perSheet; slot++) {
		const outline = el('div', 'slot');
		position(outline, slot, offset);
		page.append(outline);
	}
	return page;
}

/**
 * Render print sheets into `container`.
 * job: { labels: { price: string, condition: string }[], start: number, monthText: string, color: string }
 */
export function renderLabels(container, job, offset) {
	container.replaceChildren();
	const pages = [];

	for (const { item, page, slot } of placeLabels(job.labels, job.start)) {
		if (!pages[page]) {
			pages[page] = createPage(offset);
			container.append(pages[page]);
		}
		const label = el('div', 'label');
		position(label, slot, offset);

		const bar = el('div', 'label-bar');
		bar.style.backgroundColor = job.color;

		const body = el('div', 'label-body');
		const price = el('div', 'label-price', item.price);
		if (item.price.length > 5) {
			// "100,00" and up would not fit at the regular size.
			price.classList.add('label-price-long');
		}
		const footer = el('div', 'label-footer');
		footer.append(el('span', 'label-month', job.monthText), el('span', 'label-condition', item.condition));
		body.append(price, footer);

		label.append(bar, body);
		pages[page].append(label);
	}

	return pages.length;
}

/** Every slot outlined, to check printer alignment on plain paper. */
export function renderCalibration(container, offset) {
	container.replaceChildren();
	const page = createPage(offset);
	page.classList.add('page-calibration');
	container.append(page);
}
