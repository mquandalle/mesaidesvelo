import { compile } from 'mdsvex';
import aidesAndCollectivities from '$lib/data/aides-collectivities.json';
import communes from '$lib/data/communes.json';
import { error } from '@sveltejs/kit';
import { engine } from '$lib/engine';

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
		département: {}
	}
);

const availableContent = Object.fromEntries(
	Object.entries(import.meta.glob('../../../content/*.svx', { as: 'raw', eager: true })).map(
		([name, mod]) => [
			name
				.split('/')
				.at(-1)
				.replace(/\.svx$/, ''),
			mod
		]
	)
);

const hasCorrespondingContent = (ruleName) =>
	ruleName &&
	Object.keys(availableContent)
		.map((leafName) => `aides . ${leafName}`)
		.includes(ruleName);

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const slug = params.slug;
	const localisation = communes.find((c) => c.slug === slug);

	if (!localisation) {
		throw error(404);
	}

	const villeRuleName = ruleNamePerCollectivity['code insee'][localisation.code];
	const epciRuleName = ruleNamePerCollectivity['epci'][localisation.epci];
	const departementRuleName =
		ruleNamePerCollectivity['département'][localisation.departement ?? code.slice(0, 2)];
	const regionRuleName = ruleNamePerCollectivity['région'][localisation.region];

	if (
		[villeRuleName, epciRuleName, departementRuleName, regionRuleName].every(
			(ruleName) => ruleName === undefined
		)
	) {
		return { infos: { onlyNationalAides: true } };
	}

	let infos = {};
	if (hasCorrespondingContent(epciRuleName)) {
		const source = availableContent[epciRuleName.replace('aides . ', '')];
		const text = (await compile(source)).code;
		infos.epci = {
			ruleName: epciRuleName,
			titre: engine.getRule(epciRuleName).rawNode.titre,
			text
		};
	}

	if (hasCorrespondingContent(regionRuleName) && !villeRuleName && !epciRuleName) {
		const source = availableContent[regionRuleName.replace('aides . ', '')];
		const text = (await compile(source)).code;
		return {
			infos: {
				region: {
					ruleName: regionRuleName,
					titre: engine.getRule(regionRuleName).rawNode.titre.replace(/^Région/, 'la région'),
					text
				}
			}
		};
	}

	if (villeRuleName === 'aides . mérignac') {
		infos.ville = {
			ruleName: villeRuleName,
			titre: engine.getRule(villeRuleName).rawNode.titre.replace(/^Ville/, 'la ville'),
			text: (await compile(availableContent['mérignac'])).code
		};
	}

	if (Object.keys(infos).length > 0) {
		return { infos };
	} else {
		return {};
	}
}
