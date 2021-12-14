// Pour une raison qui m'est absolument mystérieuse, il y a une différence de
// temps d'import massive entre :
// 1. import "@etalab/decoupage-administratif/data/communes.json"
// 2. JSON.stringigy(fs.readFileSync("node_modules/.../data/communes.json"))
//
// La première ligne met environ 5s, la deuxième environ 5ms.
//
// Les utilitaires ci-dessous ont donc pour objet d'utiliser la deuxième
// méthode, bien qu'il vaudrait mieux identifier la cause racine de cette
// étrange pénalité de x1000 en passant par la syntaxe d'import direct.
import fs from 'fs';
import { join, dirname } from 'path';

export function loadJsonFile(path) {
	const absolutePath = new URL(join('../../', path), import.meta.url).pathname;
	return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
}

export function writeJsonFile(path, data) {
	const absolutePath = new URL(join('../../', path), import.meta.url).pathname;
	const parentDir = dirname(absolutePath);
	if (!fs.existsSync(parentDir)) {
		fs.mkdirSync(parentDir, { recursive: true });
	}
	return fs.writeFileSync(absolutePath, JSON.stringify(data, null, 2), 'utf8');
}
