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
	Object.entries(import.meta.glob('/src/content/*.svx', { as: 'raw', eager: true })).map(
		([name, mod]) => [
			name
				.split('/')
				.at(-1)
				.toLowerCase()
				.replace(/\.svx$/, ''),
			mod
		]
	)
);

const ruleToContentFilename = (ruleName) => ruleName.toLowerCase().replace('aides . ', '');

const hasCorrespondingContent = (ruleName) =>
	ruleName && Object.keys(availableContent).includes(ruleToContentFilename(ruleName));

const getCorrespondingContent = async (ruleName) => {
	const source = availableContent[ruleToContentFilename(ruleName)];
	const text = (await compile(source)).code;
	return text;
};

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const slug = params.slug;
	const localisation = communes.find((c) => c.slug === slug);

	if (!localisation) {
		throw error(404);
	}

	if (localisation.pays && localisation.pays !== 'france') {
		if (hasCorrespondingContent(localisation.pays)) {
			return {
				infos: {
					pays: {
						text: await getCorrespondingContent(localisation.pays)
					}
				}
			};
		}
		return {};
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
		const text = await getCorrespondingContent(epciRuleName);
		infos.epci = {
			ruleName: epciRuleName,
			titre: engine.getRule(epciRuleName).rawNode.titre,
			text
		};
	}

	// TODO : généraliser
	if (villeRuleName === 'aides . mérignac') {
		infos.ville = {
			ruleName: villeRuleName,
			titre: engine.getRule(villeRuleName).rawNode.titre.replace(/^Ville/, 'la ville'),
			text: await getCorrespondingContent('mérignac')
		};
	}

	if (hasCorrespondingContent(regionRuleName)) {
		const text = await getCorrespondingContent(regionRuleName);
		infos.region = {
			ruleName: regionRuleName,
			titre: engine.getRule(regionRuleName).rawNode.titre.replace(/^Région/, 'la région'),
			text
		};
	}

	if (hasCorrespondingContent(departementRuleName)) {
		const text = await getCorrespondingContent(departementRuleName);
		infos.département = {
			ruleName: departementRuleName,
			titre: engine
				.getRule(departementRuleName)
				.rawNode.titre.replace(/^Département/, 'le département'),
			text
		};
	}

	if (Object.keys(infos).length > 0) {
		return { infos };
	} else {
		return {};
	}
}
