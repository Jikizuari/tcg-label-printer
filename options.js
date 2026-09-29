import { DEFAULT_COLORS } from './src/months.js';
import { DEFAULT_SETTINGS, loadSettings, saveSettings, saveJob } from './src/settings.js';

const $ = (id) => document.getElementById(id);
let savedTimer;

async function save(partial) {
	await saveSettings(partial);
	$('saved').hidden = false;
	clearTimeout(savedTimer);
	savedTimer = setTimeout(() => {
		$('saved').hidden = true;
	}, 1500);
}

function renderColors(colors) {
	const container = $('colors');
	container.replaceChildren();
	colors.forEach((hex, index) => {
		const row = document.createElement('label');
		row.className = 'color';

		const month = document.createElement('span');
		month.className = 'color-month';
		month.textContent = String(index + 1).padStart(2, '0');

		const input = document.createElement('input');
		input.type = 'color';
		input.value = hex;
		input.addEventListener('change', async () => {
			const settings = await loadSettings();
			settings.colors[index] = input.value;
			await save({ colors: settings.colors });
		});

		const name = document.createElement('span');
		name.textContent = DEFAULT_COLORS[index].name;

		row.append(month, input, name);
		container.append(row);
	});
}

function fill(settings) {
	renderColors(settings.colors);
	$('offsetX').value = settings.offsetX;
	$('offsetY').value = settings.offsetY;
	$('next').textContent = settings.nextLabel;
}

async function init() {
	fill(await loadSettings());

	for (const key of ['offsetX', 'offsetY']) {
		$(key).addEventListener('change', () => save({ [key]: Number($(key).value) || 0 }));
	}

	$('new-sheet').addEventListener('click', async () => {
		await save({ nextLabel: 1 });
		$('next').textContent = 1;
	});

	$('calibrate').addEventListener('click', async () => {
		await saveJob({ calibration: true });
		chrome.tabs.create({ url: chrome.runtime.getURL('print.html') });
	});

	$('reset').addEventListener('click', async () => {
		const { nextLabel } = await loadSettings();
		const settings = { ...DEFAULT_SETTINGS, colors: [...DEFAULT_SETTINGS.colors], nextLabel };
		await save(settings);
		fill(settings);
	});
}

init();
