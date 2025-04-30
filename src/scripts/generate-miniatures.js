/**
 * Download the images from github (aides-jeune repo) and create the miniatures
 * from them.
 */
import fs from 'fs';
import { miniatures } from '@betagouv/aides-velo/data';
import sharp from 'sharp';
import { join } from 'path';

import { writeJsonData } from '../scripts/writeData.js';
import aidesWithCollectivities from '../lib/data/aides-collectivities.json' with { type: 'json' };

const currentPath = new URL('./', import.meta.url).pathname;
const rootPath = join(currentPath, '../../');

const miniatureDirectory = join(rootPath, 'static/miniatures/');
if (fs.existsSync(miniatureDirectory)) {
	fs.rmSync(miniatureDirectory, { recursive: true });
}
fs.mkdirSync(miniatureDirectory, { recursive: true });

const thumbnailsManifest = Object.keys(aidesWithCollectivities).reduce((acc, id) => {
	const imgSrc = miniatures[id];

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
