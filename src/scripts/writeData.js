import fs from 'node:fs';
import { join } from 'path';

export function writeJsonData(filename, data) {
	const dataDir = new URL('../lib/data', import.meta.url).pathname;
	if (!fs.existsSync(dataDir)) {
		fs.mkdirSync(dataDir, { recursive: true });
	}
	return fs.writeFileSync(join(dataDir, filename), JSON.stringify(data, null, 2), 'utf8');
}
