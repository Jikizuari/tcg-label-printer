import { renderLabels, renderCalibration } from './src/render.js';
import { nextStart } from './src/layout.js';
import { loadSettings, saveSettings, loadJob } from './src/settings.js';

const status = document.getElementById('status');
const sheets = document.getElementById('sheets');
const buttons = {
	reprint: document.getElementById('reprint'),
	cancel: document.getElementById('cancel'),
	confirm: document.getElementById('confirm'),
};

function show(...names) {
	for (const [name, button] of Object.entries(buttons)) {
		button.hidden = !names.includes(name);
	}
}

async function init() {
	const [job, settings] = await Promise.all([loadJob(), loadSettings()]);
	if (!job) {
		status.textContent = 'Geen printopdracht gevonden. Start opnieuw vanuit de extensie.';
		return;
	}
	const offset = { x: Number(settings.offsetX) || 0, y: Number(settings.offsetY) || 0 };

	buttons.reprint.addEventListener('click', () => window.print());
	buttons.cancel.addEventListener('click', () => window.close());

	if (job.calibration) {
		renderCalibration(sheets, offset);
		status.textContent = 'Uitlijntest: print op gewoon papier en leg het tegen een etikettenvel.';
		show('reprint');
	} else {
		const pages = renderLabels(sheets, job, offset);
		const next = nextStart(job.start, job.labels.length);
		status.textContent = `${job.labels.length} labels vanaf label ${job.start}`
			+ (pages > 1 ? ` (${pages} vellen)` : '')
			+ `. Zijn ze goed geprint? Dan begint de volgende print bij label ${next}.`;
		buttons.confirm.addEventListener('click', async () => {
			await saveSettings({ nextLabel: next });
			window.close();
		});
		show('reprint', 'cancel', 'confirm');
	}

	// Let layout settle before opening the dialog.
	requestAnimationFrame(() => setTimeout(() => window.print(), 100));
}

init();
