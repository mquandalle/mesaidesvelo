/**
 * Download the images from github (aides-jeune repo) and create the miniatures
 * from them.
 */
import { miniatures } from '@betagouv/aides-velo/data';
import fs from 'fs';
import { join } from 'path';
import sharp from 'sharp';

import aidesWithCollectivities from '../lib/data/aides-collectivities.json' with { type: 'json' };
import { writeJsonData } from './writeData.js';

const currentPath = new URL('./', import.meta.url).pathname;
const rootPath = join(currentPath, '../../');

const miniatureDirectory = join(rootPath, 'static/miniatures/');
if (fs.existsSync(miniatureDirectory)) {
	fs.rmSync(miniatureDirectory, { recursive: true });
}
fs.mkdirSync(miniatureDirectory, { recursive: true });

const thumbnailsManifest = {};
const ids = Object.keys(aidesWithCollectivities);

for (const id of ids) {
	let imgSrc = miniatures[id];

	if (!imgSrc) {
		continue;
	}

	const imgName = imgSrc.split('/').at(-1).split('.')[0] + '.webp';
	await generateThumbnail(imgSrc, imgName);
	thumbnailsManifest[id] = imgName;

	if (imgSrc.startsWith('https://upload.wikimedia.org/')) {
		console.log(`Waiting to avoid Wikimedia rate limiting...`);
		await new Promise((resolve) => setTimeout(resolve, 3000));
	}
}

async function generateThumbnail(imgSrc, imgName) {
	const resp = await fetch(imgSrc);

	if (!resp.ok) {
		console.error(`Fail fetching ${imgSrc} – HTTP status: ${resp.status}`);
		return;
	}

	const contentType = resp.headers.get('content-type') || '';
	if (!contentType.startsWith('image/')) {
		console.error(`Content-Type is not an image for ${imgSrc}: ${contentType}`);
		return;
	}

	const buffer = Buffer.from(await resp.arrayBuffer());
	const img = sharp(buffer);
	await img
		.resize({ fit: 'inside', height: 170, width: 120 })
		.webp()
		.toFile(join(miniatureDirectory, imgName));
}

writeJsonData('miniatures.json', thumbnailsManifest);
