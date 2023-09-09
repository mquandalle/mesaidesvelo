import { JSDOM } from 'jsdom';
import epci from '@etalab/decoupage-administratif/data/epci.json' assert { type: 'json' };
import { slugify } from '../src/lib/utils.js';
import { writeJsonData } from '../src/scripts/writeData.js';

const source = await fetch('https://www.villes.plus/cyclables/metropoles');
const { document } = new JSDOM(await source.text()).window;

const rawMetropoles = [...document.querySelectorAll('h3')].map((h3) => h3.textContent);

const simplify = (s) =>
	slugify(s)
		.replace(/[0-9]/g, '')
		.replace(/((euro)?metropole|de|)/g, '')
		.replace(/(^-+|-+$)/g, '');

const normalizedEpciNames = rawMetropoles.map(
	(line) => epci.find(({ nom }) => simplify(nom).includes(simplify(line)))?.nom
);

if (normalizedEpciNames.find((n) => !n)) {
	console.log('❌ Missing EPCI:');
	console.log(normalizedEpciNames.filter(Boolean).join('\n'));
} else {
	console.log("✅ All EPCI's found:");
	console.log(normalizedEpciNames.join('\n'));
	writeJsonData('classement-villeplus.json', normalizedEpciNames);
}
