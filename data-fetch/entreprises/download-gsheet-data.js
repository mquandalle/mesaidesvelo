import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const spreadsheetId = '13h-hrwrnrDLVGSnrzvDyn8zy0UkocOoTZmcu7B1v3S0';
const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
	throw new Error('GOOGLE_API_KEY is required to download entreprise data from Google Sheets.');
}

const downloads = [
	{
		range: 'Aide par entreprise!A2:E',
		output: 'data-fetch/entreprises/data/gsheet-forfaits.json',
	},
	{
		range: 'Liste noire!A2:A',
		output: 'data-fetch/entreprises/data/gsheet-blacklist.json',
	},
];

await Promise.all(downloads.map(downloadSheetRange));

async function downloadSheetRange({ range, output }) {
	const url = new URL(
		`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
			range,
		)}`,
	);
	url.searchParams.set('key', apiKey);

	const response = await fetch(url);
	if (!response.ok) {
		const body = await response.text();
		throw new Error(
			`Google Sheets API returned ${response.status} for range "${range}": ${body.slice(0, 500)}`,
		);
	}

	await mkdir(dirname(output), { recursive: true });
	await writeFile(output, await response.text());
}
