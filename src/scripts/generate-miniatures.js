/**
 * Download the images from github (aides-jeune repo) and create the miniatures
 * from them.
 */
import { miniatures } from '@betagouv/aides-velo/data';
import fs from 'fs';
import { join } from 'path';
import sharp from 'sharp';

import aidesWithCollectivities from '../lib/data/aides-collectivities.json' with { type: 'json' };
import { writeJsonData } from '../scripts/writeData.js';

const currentPath = new URL('./', import.meta.url).pathname;
const rootPath = join(currentPath, '../../');

const miniatureDirectory = join(rootPath, 'static/miniatures/');
if (fs.existsSync(miniatureDirectory)) {
	fs.rmSync(miniatureDirectory, { recursive: true });
}
fs.mkdirSync(miniatureDirectory, { recursive: true });

const thumbnailsManifest = Object.keys(aidesWithCollectivities).reduce((acc, id) => {
	let imgSrc = miniatures[id];

	if (!imgSrc) {
		return acc;
	}

	const imgName = imgSrc.split('/').at(-1).split('.')[0] + '.webp';
	generateThumbnail(imgSrc, imgName);

	return { ...acc, [id]: imgName };
}, {});

async function generateThumbnail(imgSrc, imgName) {
	const resp = await fetch(imgSrc);
	const blob = await resp.blob();
	const buffer = await blob.arrayBuffer();
	const img = sharp(buffer);
	img.resize({ fit: 'inside', height: 170, width: 120 });
	img.webp().toFile(join(miniatureDirectory, imgName));
}

writeJsonData('miniatures.json', thumbnailsManifest);
