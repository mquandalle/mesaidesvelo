import fs from 'node:fs';
import yaml from 'js-yaml';
import fetch from 'node-fetch';

// cli param --grep to filter the links to check
const grepOptionIndex = process.argv
	.slice(2)
	.findIndex((arg) => arg.includes('--grep') || arg.includes('-g'));

const grepFilter = grepOptionIndex !== -1 ? process.argv.slice(2)[grepOptionIndex + 1] : null;

// Extrait la liste des liens référencés dans la base de règles
const aidesSrc = fs.readFileSync(new URL('../aides.yaml', import.meta.url).pathname);
const links = Object.entries(yaml.load(aidesSrc))
	.reduce((acc, [, rule]) => [...acc, { title: rule?.titre ?? null, link: rule?.lien ?? null }], [])
	.filter(({ link }) => link !== null && (grepFilter === null || link.includes(grepFilter)));

// Certains sites référencés ont des problèmes de certificats, mais ce n'est pas
// ce que nous cherchons à détecter ici.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

// Création d'une queue permettant de paralléliser la vérification des liens
const queue = [...links];
const detectedErrors = [];
const simultaneousItems = 5;

async function processNextQueueItem() {
	if (queue.length !== 0) {
		await fetchAndReport(queue.shift());
		await processNextQueueItem();
	}
}

async function fetchAndReport({ link, title }) {
	let status = await getHTTPStatus(link);

	// Retries in case of timeout
	let remainingRetries = 3;
	while (status === 499 && remainingRetries > 0) {
		remainingRetries--;
		await sleep(20_000);
		status = await getHTTPStatus(link);
	}
	report({ status, link, title });
}

async function getHTTPStatus(link) {
	const maxTime = 15_000;
	const controller = new AbortController();
	setTimeout(() => controller.abort(), maxTime);

	try {
		const res = await fetch(link, { signal: controller.signal });
		return res.status;
	} catch (err) {
		return 499;
	}
}

async function report({ status, link, title }) {
	console.log(status === 200 ? '✅' : '❌', status, link);
	if (status !== 200) {
		detectedErrors.push({ status, link, title });
	}
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
	await Promise.allSettled(Array.from({ length: simultaneousItems }).map(processNextQueueItem));
	if (detectedErrors.length > 0) {
		// Formattage spécifique pour récupérer le résultat avec l'action Github
		if (process.argv.slice(2).includes('--ci')) {
			const message = `
            
			Certains liens référencés ne semblent plus fonctionner :
			
			| Aide | Status HTTP |
			|---|---|
			${detectedErrors
				.map(({ status, title, link }) => `| [${title}](${link}) | ${status} |`)
				.join('\n')}`;

			const format = (msg) =>
				msg
					.trim()
					.split('\n')
					.map((line) => line.trim())
					.join('<br />');
			console.log(`::set-output name=comment::${format(message)}`);
		} else if (detectedErrors) {
			console.log('Liens invalides :' + detectedErrors.map(({ link }) => `\n- ${link}`));
		}

		console.log('Terminé');
	}
})();
