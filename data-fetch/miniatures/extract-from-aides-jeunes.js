import fs from 'node:fs';
import { join } from 'node:path';
import { URL } from 'node:url';
import sharp from 'sharp';
import { writeJsonData } from '../../src/scripts/writeData.js';

import aidesWithCollectivities from '../../src/lib/data/aides-collectivities.json' assert { type: 'json' };

const currentPath = new URL('./', import.meta.url).pathname;
const repoPath = join(currentPath, 'aides-jeunes-repo/');
const rootPath = join(currentPath, '../../');
const metadataDirectory = join(repoPath, 'data/institutions/');

if (!fs.existsSync(metadataDirectory)) {
	console.warn('Impossible de télécharger les miniatures');
	console.log('Essayez de télécharger le sous-module aides-jeunes :');
	console.log('git submodule update --init --recursive --depth 1');
	process.exit();
}

// Map aides-jeunes identifiers with mesaidesvélo types.
function imgKey({ type, code_siren, code_insee }) {
	const toInt = (str) => parseInt(str.replace(/[^\d]/g, ''), 10);
	if (type === 'commune') {
		return `code insee - ${toInt(code_insee)}`;
	} else if (type === 'epci') {
		return `epci - ${toInt(code_siren)}`;
	} else if (type === 'departement') {
		return `département - ${toInt(code_insee)}`;
	} else if (type === 'region') {
		return `région - ${toInt(code_insee)}`;
	} else if (type === 'national') {
		return `pays - France`;
	}
}

const imagesFromAidesJeunes = Object.fromEntries([
	...fs.readdirSync(metadataDirectory).map((file) => {
		const filePath = metadataDirectory + '/' + file;
		const fileContent = fs.readFileSync(filePath, 'utf8');
		const fieldsToRetrieve = ['imgSrc', 'type', 'code_siren', 'code_insee'];
		const data = Object.fromEntries(
			fileContent
				.split('\n')
				.map((line) => line.split(':').map((field) => field.trim()))
				.filter(([key]) => fieldsToRetrieve.includes(key))
		);

		return [imgKey(data), data];
	}),
	['pays - France', { imgSrc: 'img/institutions/logo_etat_francais.png' }],
]);

const miniatureDirectory = join(rootPath, 'static/miniatures/');
if (fs.existsSync(miniatureDirectory)) {
	fs.rmSync(miniatureDirectory, { recursive: true });
}
fs.mkdirSync(miniatureDirectory, { recursive: true });

const thumbnailsManifest = Object.entries(aidesWithCollectivities).reduce((acc, [id, aide]) => {
	const aideId = `${aide.collectivity.kind} - ${aide.collectivity.code ?? aide.collectivity.value}`;

	const img = imagesFromAidesJeunes[aideId];

	if (!img) {
		return acc;
	}

	const imgName = img.imgSrc.split('/').at(-1).split('.')[0] + '.webp';
	generateThumbnail(img.imgSrc, imgName);

	return { ...acc, [id]: imgName };
}, {});

async function generateThumbnail(imgSrc, imgName) {
	const imgPath = join(repoPath, 'public/', imgSrc);
	const img = sharp(imgPath);
	await img.resize({ fit: 'inside', height: 170, width: 120 });
	await img.webp().toFile(join(miniatureDirectory, imgName));
}

writeJsonData('miniatures.json', thumbnailsManifest);
