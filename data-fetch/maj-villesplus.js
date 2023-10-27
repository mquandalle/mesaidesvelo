import { JSDOM } from 'jsdom';
import epci from '@etalab/decoupage-administratif/data/epci.json' assert { type: 'json' };
import { slugify } from '../src/lib/utils.js';
import { writeJsonData } from '../src/scripts/writeData.js';

const baseUrl = 'https://www.villes.plus/cyclables';
const classsements = ['departements', 'metropoles', 'grandes-villes', 'prefectures', 'communes'];

const fetchAndNormalize = async (classement) => {
	const sourceCode = await fetch(`${baseUrl}/${classement}`);
	const { document } = new JSDOM(await sourceCode.text()).window;
	const rawData = [...document.querySelectorAll('h3')].map((h3) => h3.textContent);
	const cleanData = classement === 'metropoles' ? normalizeEpci : removeLeadNumbers;
	return [classement, rawData.map(cleanData)];
};
const removeLeadNumbers = (s) => s.replace(/^[0-9🥇🥈🥉]+/, '').trim();
const simplify = (s) =>
	slugify(removeLeadNumbers(s))
		.replace(/((euro)?metropole|de|)/g, '')
		.replace(/(^-+|-+$)/g, '');
const normalizeEpci = (s) => epci.find(({ nom }) => simplify(nom).includes(simplify(s)))?.nom;

const data = Object.fromEntries(await Promise.all(classsements.map(fetchAndNormalize)));

if (data.metropoles.find((n) => !n)) {
	console.log('❌ Missing EPCI:');
	console.log(data.metropoles.filter(Boolean).join('\n'));
} else {
	writeJsonData('classement-villeplus.json', data);
}
