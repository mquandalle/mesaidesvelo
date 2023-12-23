import { removeAccents } from '$lib/utils';
import fuzzysort from 'fuzzysort';
import entreprisesDataCSV from '$entreprises/entreprises.csv?raw';
import gSheetForfaits from '$entreprises/gsheet-forfaits.json';
import blackList from '$entreprises/gsheet-blacklist.json';

const entreprisesToRemoveFromInseeData = new Set(
	[...gSheetForfaits.values.map(([nom]) => nom), ...blackList.values]
		.flat()
		.map((name) => name.toLowerCase()),
);

const tranchesEffectifInsee = {
	11: 10,
	12: 20,
	21: 50,
	22: 100,
	31: 200,
	32: 250,
	41: 500,
	42: 1000,
	51: 2000,
	52: 5000,
	53: 10000,
};

const indexedData = [
	...entreprisesDataCSV
		.split('\n')
		.slice(1)
		.filter((line) => !entreprisesToRemoveFromInseeData.has(line.split(',')[0].toLowerCase()))
		.map((line) => {
			const [nom, siren, effectif] = line.split(',');
			return {
				nom: capitalizeWords(nom),
				siren,
				indexedName: fuzzysort.prepare(removeAccents(nom)),
				effectif: tranchesEffectifInsee[effectif] || 0,
			};
		}),
	...gSheetForfaits.values.map(([nom, effectif, forfaitMax, commentaire, reference]) => ({
		nom,
		indexedName: fuzzysort.prepare(removeAccents(nom)),
		forfaitMax: forfaitMax && Number(forfaitMax),
		effectif: Number(effectif ?? 0),
		commentaire,
		reference,
	})),
];

function capitalizeWords(str) {
	return str
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ');
}

const searchOptions = {
	keys: ['indexedName'],
	limit: 10,
	threshold: -1000,
	scoreFn: (a) =>
		// testé à la main pour faire remonter les plus grosses villes en premier
		a[0] ? a[0].score * (1 - Math.log((a.obj.effectif || 1000) / 10000) * 0.8) : -1001,
};

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const search = removeAccents(url.searchParams.get('search')?.replace(/\s/g, '').toLowerCase());
	const pick = ({ nom, effectif, forfaitMax, commentaire, reference }) => ({
		nom,
		effectif,
		forfaitMax,
		commentaire,
		reference,
	});
	if (search) {
		return new Response(
			JSON.stringify(
				fuzzysort.go(search, indexedData, searchOptions).map(({ obj: res }) => pick(res)),
			),
		);
	} else {
		// Par défaut on retourne les entreprises avec le plus de salariés les plus peuplées
		return new Response(
			JSON.stringify(
				indexedData
					.sort((a, b) => b.effectif - a.effectif)
					.slice(0, 10)
					.map(pick),
			),
		);
	}
}
