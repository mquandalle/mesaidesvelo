import { compile } from 'mdsvex';
import aidesAndCollectivities from '$lib/data/aides-collectivities.json';
import communes from '$lib/data/communes.json';
import labelTourDeFrance from '/src/content/label-tour-de-france.json';
import labelTourDeFranceCommentairesSource from '/src/content/label-tour-de-france-commentaires.txt?raw';
import barometreFubRawCsv from '/src/content/barometre-fub.csv?raw';
import { error } from '@sveltejs/kit';
import { engine } from '$lib/engine';
import { rawCityToFullLocalisation } from '$lib/utils';
import classementVilleplus from '$lib/data/classement-villeplus.json';

const barometreFubPerCity = Object.fromEntries(
	barometreFubRawCsv
		.trim()
		.split('\n')
		.map((row) => row.split(';'))
);

const labelTourDeFranceCommentairesLines = labelTourDeFranceCommentairesSource
	.split('\n')
	.map((l) => l.trim())
	.filter(Boolean);
const commentairesLabelTourDeFrance = labelTourDeFranceCommentairesLines.reduce((dic, line, n) => {
	if (n % 2 === 0) {
		return dic;
	} else {
		return { ...dic, [labelTourDeFranceCommentairesLines[n - 1].toLowerCase()]: line };
	}
}, {});

const ruleNamePerCollectivity = Object.entries(aidesAndCollectivities).reduce(
	(manifest, [ruleName, { collectivity }]) => {
		manifest[collectivity.kind][collectivity.value] = ruleName;
		return manifest;
	},
	{
		pays: {},
		epci: {},
		'code insee': {},
		région: {},
		département: {},
	}
);

const availableContent = Object.fromEntries(
	Object.entries(import.meta.glob('/src/content/*.svx', { as: 'raw', eager: true })).map(
		([name, mod]) => [
			name
				.split('/')
				.at(-1)
				.toLowerCase()
				.replace(/\.svx$/, ''),
			mod,
		]
	)
);

const ruleToContentFilename = (ruleName) => ruleName.toLowerCase().replace('aides . ', '');

const hasCorrespondingContent = (ruleName) =>
	ruleName && Object.keys(availableContent).includes(ruleToContentFilename(ruleName));

export const _getCorrespondingContent = async (ruleName, { prepend } = {}) => {
	if (!hasCorrespondingContent(ruleName)) {
		return undefined;
	}
	const source = availableContent[ruleToContentFilename(ruleName)];
	const modifiedText = prependPartialSentence(source, { prepend });
	const text = (await compile(modifiedText)).code;
	return text;
};

const prependPartialSentence = (content, { prepend } = {}) =>
	prepend ? prepend + content.slice(0, 1).toLowerCase() + content.slice(1) : content;

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const slug = params.slug;
	const city = communes.find((c) => c.slug === slug);
	if (!city) {
		throw error(404);
	}

	const localisation = rawCityToFullLocalisation(city);

	const baseData = { ville: localisation };
	const infos = {};

	if (localisation.pays && localisation.pays !== 'france') {
		if (hasCorrespondingContent(localisation.pays)) {
			infos.pays = {
				text: await _getCorrespondingContent(localisation.pays),
			};
		}
		return { ...baseData, infos };
	}

	const villeRuleName = ruleNamePerCollectivity['code insee'][localisation.codeInsee];
	const epciRuleName = ruleNamePerCollectivity['epci'][localisation.epci];
	const departementRuleName = ruleNamePerCollectivity['département'][localisation.departement];
	const regionRuleName = ruleNamePerCollectivity['région'][localisation.region];

	if (
		[villeRuleName, epciRuleName, departementRuleName, regionRuleName].every(
			(ruleName) => ruleName === undefined
		)
	) {
		infos.onlyNationalAides = true;
	}

	if (hasCorrespondingContent(epciRuleName)) {
		infos.epci = {
			ruleName: epciRuleName,
			titre: engine.getRule(epciRuleName).rawNode.titre,
			text: await _getCorrespondingContent(epciRuleName),
		};
	}

	if (hasCorrespondingContent(villeRuleName)) {
		infos.ville = {
			ruleName: villeRuleName,
			titre: engine.getRule(villeRuleName).rawNode.titre.replace(/^Ville/, 'la ville'),
			text: await _getCorrespondingContent(villeRuleName, {
				prepend: infos.epci ? `En plus de l’aide versée par ${infos.epci.titre}, ` : '',
			}),
		};
	}

	if (hasCorrespondingContent(regionRuleName)) {
		infos.region = {
			ruleName: regionRuleName,
			titre: engine.getRule(regionRuleName).rawNode.titre.replace(/^Région/, 'la région'),
			text: await _getCorrespondingContent(regionRuleName),
		};
	}

	if (hasCorrespondingContent(departementRuleName)) {
		infos.département = {
			ruleName: departementRuleName,
			titre: engine
				.getRule(departementRuleName)
				.rawNode.titre.replace(/^Département/, 'le département'),
			text: await _getCorrespondingContent(departementRuleName, {
				prepend: infos.region ? `En plus de l’aide versée par ${infos.region.titre}, ` : '',
			}),
		};
	}

	if (Object.keys(labelTourDeFrance).includes(localisation.nom.toLowerCase())) {
		infos.labelTourDeFrance = {
			note: labelTourDeFrance[localisation.nom.toLowerCase()],
			commentaire: commentairesLabelTourDeFrance[localisation.nom.toLowerCase()],
		};
	}

	const classementsVillePlusPriority = ['grandes-villes', 'prefectures', 'communes'];

	let classementPosition = -1;
	const typeClassement = classementsVillePlusPriority.find((classement) => {
		classementPosition = classementVilleplus[classement].findIndex(
			(nom) => nom.toLowerCase() === city.nom.toLowerCase()
		);
		return classementPosition > -1;
	});

	if (typeClassement) {
		infos.classementVillePlus = {
			typeClassement,
			teritoireClasse: city.nom,
			position: classementPosition + 1,
			total: classementVilleplus[typeClassement].length,
		};
	} else {
		const posClassementVillePlus = classementVilleplus.metropoles.findIndex(
			(epci) => epci === localisation.epci
		);
		if (posClassementVillePlus > -1) {
			infos.classementVillePlus = {
				typeClassement: 'metropoles',
				teritoireClasse: localisation.epci.nom,
				position: posClassementVillePlus + 1,
				total: classementVilleplus.metropoles.length,
			};
		}
	}

	if (barometreFubPerCity[localisation.codeInsee]) {
		const labelsFub = {
			G: 'très défavorable',
			F: 'défavorable',
			E: 'plutôt défavorable',
			D: 'moyennement favorable',
			C: 'plutôt favorable',
			B: 'favorable',
			A: 'très favorable',
			'A+': 'moyennement',
		};
		const note = barometreFubPerCity[localisation.codeInsee];
		infos.barometreFub = {
			note,
			label: labelsFub[note],
		};
	}

	return { ...baseData, infos };
}
