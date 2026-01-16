/**
 * Download the images from github (aides-jeune repo) and create the miniatures
 * from them.
 */
import { miniatures } from '@betagouv/aides-velo/data';
import fs from 'fs';
import { join } from 'path';
import sharp from 'sharp';

import got from 'got';
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
	const filePath = join(miniatureDirectory, imgName);

	if (fs.existsSync(filePath)) {
		console.log(`Thumbnail ${imgName} already exists, skipping download.`);
		continue;
	}

	try {
		await generateThumbnail(imgSrc, filePath);
		console.log(`Generated thumbnail for aid ID ${id}`);
		thumbnailsManifest[id] = imgName;
	} catch (e) {
		console.error(`Failed to generate thumbnail for aid ID ${id}: ${e.message}`);
	}

	if (imgSrc.startsWith('https://upload.wikimedia.org/')) {
		console.log(`Waiting to avoid Wikimedia rate limiting...`);
		await new Promise((resolve) => setTimeout(resolve, 5000));
	}
}

async function generateThumbnail(imgSrc, filePath) {
	const buffer = await got(imgSrc, {
		headers: {
			'user-agent':
				'mesaidesvelo/1.0 (https://github.com/mquandalle/mesaidesvelo; contact: emile@calinou.coop)',
		},
		retry: {
			limit: 5,
		},
		timeout: { request: 30000 },
	}).buffer();

	await sharp(buffer).resize({ fit: 'inside', height: 170, width: 120 }).webp().toFile(filePath);
}

writeJsonData('miniatures.json', thumbnailsManifest);
