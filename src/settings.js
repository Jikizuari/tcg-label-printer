import { DEFAULT_COLORS } from './months.js';

export const DEFAULT_SETTINGS = {
	nextLabel: 1,
	colors: DEFAULT_COLORS.map((color) => color.hex),
	offsetX: 0,
	offsetY: 0,
};

export function loadSettings() {
	return chrome.storage.local.get(DEFAULT_SETTINGS);
}

export function saveSettings(partial) {
	return chrome.storage.local.set(partial);
}

export async function loadJob() {
	const { job } = await chrome.storage.local.get('job');
	return job;
}

export function saveJob(job) {
	return chrome.storage.local.set({ job });
}
