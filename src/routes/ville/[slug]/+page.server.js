import { compile } from 'mdsvex';
import aidesAndCollectivities from '$lib/data/aides-collectivities.json';
import communes from '$lib/data/communes.json';
import { error } from '@sveltejs/kit';

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

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const slug = params.slug;
	const localisation = communes.find((c) => c.slug === slug);

	if (!localisation) {
		throw error(404);
	}

	const epciRuleName = ruleNamePerCollectivity['epci'][localisation.epci];

	if (
		Object.keys(availableContent)
			.map((leafName) => `aides . ${leafName}`)
			.includes(epciRuleName)
	) {
		const source = await availableContent[epciRuleName.replace('aides . ', '')];
		const epciText = (await compile(source)).code;
		return { epciRuleName, epciText };
	} else return {};
}
