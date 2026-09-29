import { readCards } from './src/reader.js';
import { roundPrice, formatPrice } from './src/pricing.js';
import { SHEET, placeLabels } from './src/layout.js';
import { DEFAULT_COLORS, monthCode } from './src/months.js';
import { loadSettings, saveSettings, saveJob } from './src/settings.js';

const $ = (id) => document.getElementById(id);

function fail(message) {
	$('error').textContent = message;
	$('error').hidden = false;
	$('ready').hidden = true;
}

function clampStart(value) {
	const start = Math.round(Number(value));
	return Number.isFinite(start) ? Math.min(SHEET.perSheet, Math.max(1, start)) : 1;
}

async function readActiveTab() {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	if (!tab || !/^https:\/\/[^/]*tcgpowertools\.com\//.test(tab.url || '')) {
		throw new Error('Open eerst de TCG PowerTools-tab met je kaarten.');
	}
	const [injection] = await chrome.scripting.executeScript({
		target: { tabId: tab.id },
		world: 'MAIN',
		func: readCards,
	});
	const result = injection && injection.result;
	if (!result || result.error) {
		throw new Error(result ? result.error : 'Kon de pagina niet uitlezen.');
	}
	return result.cards;
}

async function init() {
	$('options').addEventListener('click', (event) => {
		event.preventDefault();
		chrome.runtime.openOptionsPage();
	});

	const settings = await loadSettings();
	let cards;
	try {
		cards = await readActiveTab();
	} catch (error) {
		fail(error.message);
		return;
	}

	const labels = cards.flatMap((card) => Array(card.quantity).fill({
		price: formatPrice(roundPrice(card.price)),
		condition: card.condition,
	}));
	if (!labels.length) {
		fail('Geen kaarten gevonden in deze tab.');
		return;
	}

	const month = monthCode(new Date());
	const color = settings.colors[month.index] || DEFAULT_COLORS[month.index].hex;

	$('count').textContent = `${labels.length} labels`;
	const monthName = new Date().toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' });
	$('month').textContent = `${monthName}: ${DEFAULT_COLORS[month.index].name}, label toont „${month.text}”`;
	$('swatch').style.backgroundColor = color;

	const unpriced = cards.filter((card) => card.unpriced).reduce((sum, card) => sum + card.quantity, 0);
	if (unpriced) {
		$('warning').textContent = `Let op: ${unpriced} kaart(en) zonder autoprijs; daarvoor wordt de ingestelde verkoopprijs gebruikt.`;
		$('warning').hidden = false;
	}

	const startInput = $('start');
	startInput.value = settings.nextLabel;

	const updateHint = () => {
		const start = clampStart(startInput.value);
		const placed = placeLabels(labels, start);
		const last = placed[placed.length - 1];
		const sheets = last.page + 1;
		$('hint').textContent = sheets > 1
			? `Label ${start} t/m 270, daarna ${sheets - 1} nieuw vel${sheets > 2 ? 'len' : ''} tot label ${last.slot}.`
			: `Label ${start} t/m ${last.slot} op dit vel.`;
	};
	startInput.addEventListener('input', updateHint);
	updateHint();

	$('new-sheet').addEventListener('click', async () => {
		startInput.value = 1;
		await saveSettings({ nextLabel: 1 });
		updateHint();
	});

	$('print').addEventListener('click', async () => {
		$('print').disabled = true;
		await saveJob({ labels, start: clampStart(startInput.value), monthText: month.text, color });
		await chrome.tabs.create({ url: chrome.runtime.getURL('print.html') });
		window.close();
	});

	$('ready').hidden = false;
}

init();
