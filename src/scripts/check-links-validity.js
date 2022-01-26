import yaml from 'js-yaml';
import fetch from 'node-fetch';
import fs from 'fs';

// Extrait la liste des liens référencés dans la base de règles
const aidesSrc = fs.readFileSync(new URL('../aides.yaml', import.meta.url).pathname);
const links = Object.entries(yaml.load(aidesSrc))
	.reduce((acc, [, rule]) => [...acc, { title: rule?.titre ?? null, link: rule?.lien ?? null }], [])
	.filter(({ link }) => link !== null);

// Certains sites référencés ont des problèmes de certificats, mais ce n'est pas
// ce que nous cherchons à détecter ici.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

// Création d'une queue permettant de paralléliser la vérification des liens
const queue = [...links];
const detectedErrors = [];
const simultaneousItems = 10;

const processNextQueueItem = async () => {
	if (queue.length !== 0) {
		await fetchAndReport(queue.shift());
		await processNextQueueItem();
	}
};

const fetchAndReport = async ({ link, title }) => {
	try {
		const res = await timeLimitedFetch(link);
		report({ status: res.status, link, title });
	} catch (err) {
		console.log(err);
		report({ status: 499, link, title });
	}
};

const timeLimitedFetch = async (link) => {
	const maxTime = 15_000;
	const controller = new AbortController();
	setTimeout(() => controller.abort(), maxTime);
	return await fetch(link, { signal: controller.signal });
};

const report = ({ status, link, title }) => {
	console.log(status === 200 ? '✅' : '❌', status, link);
	if (status !== 200) {
		detectedErrors.push({ status, link, title });
	}
};

(async () => {
	await Promise.allSettled(Array.from({ length: simultaneousItems }).map(processNextQueueItem));
	if (detectedErrors) {
		// Formattage spécifique pour récupérer le résultat avec l'action Github
		if (process.argv.slice(2).includes('--ci')) {
			const message = `
            
			Certains liens référencés ne semblent plus fonctionner :
			
			| Status HTTP | Lien |
			|---|---|
			${detectedErrors
				.map(({ status, title, link }) => `| ${status} | [${title}](${link}) |`)
				.join('\n')}`
				.trim()
				.split('\n')
				.map((line) => line.trim())
				.join('\n');
			console.log(`::set-output name=comment::${message.replace(/\n/g, '<br />')}`);
		} else {
			console.log('Liens invalides :' + detectedErrors.map(({ link }) => `\n- ${link}`));
		}
	}
})();
