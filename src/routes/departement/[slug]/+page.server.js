import aidesCollectivities from '$lib/data/aides-collectivities.json';
import { engine } from '$lib/engine';
import { slugify } from '$lib/utils';
import departements from '@etalab/decoupage-administratif/data/departements.json';
import regions from '@etalab/decoupage-administratif/data/regions.json';
import { error, redirect } from '@sveltejs/kit';
import { getCorrespondingContent } from '../../(search)/ville/[slug]/+page.server.js';

export const departementWithSlug = departements
	.filter(({ zone }) => zone === 'metro')
	.map((d) => ({ ...d, slug: slugify(d.nom) }))
	.filter((d) => d.slug !== 'paris');

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const slug = params.slug;
	const departement = departementWithSlug.find((d) => slug === d.slug);

	if (slug === 'paris') {
		throw redirect(308, '/ville/paris');
	} else if (!departement) {
		throw error(404);
	}

	const region = regions.find((r) => departement.region === r.code);

	const aideDepartement = Object.entries(aidesCollectivities).find(
		([, { collectivity }]) =>
			collectivity.kind === 'département' && collectivity.value === departement.code
	)?.[0];

	const aideDepartementText = getCorrespondingContent(aideDepartement);

	const aideRegion = Object.entries(aidesCollectivities).find(
		([, { collectivity }]) =>
			collectivity.kind === 'région' && collectivity.value === departement.region
	)?.[0];

	const aideRegionText = getCorrespondingContent(aideRegion);

	const aidesLocales = Object.entries(aidesCollectivities)
		.filter(
			([, aide]) =>
				(aide.collectivity.kind === 'epci' || aide.collectivity.kind === 'code insee') &&
				aide.departement === departement.code
		)
		.map(([ruleName, { slug }]) => ({
			titre: engine.getRule(ruleName).rawNode.titre,
			slug
		}));

	const gender = getGender(departement.code);

	return {
		departement: { ...departement, determinant: gender.determinant, habitants: gender.habitants },
		region,
		aideDepartement,
		aideDepartementText,
		aideRegion,
		aideRegionText,
		aidesLocales
	};
}

function getGender(departementCode) {
	const genders = `
    01 | Ain | l' | Aindinois
    02 | Aisne | l' | Axonais
    03 | Allier | l' | Bourbonnais
    04 | Alpes-de-Haute-Provence | les | Bas-Alpins
    05 | Hautes-Alpes | les | Hauts-Alpins
    06 | Alpes-Maritimes | les | Maralpins
    07 | Ardèche | l' | Ardéchois
    08 | Ardennes | les | Ardennais
    09 | Ariège | l' | Ariégeois
    10 | Aube | l' | Aubois
    11 | Aude | l' | Audois
    12 | Aveyron | l' | Aveyronnais
    13 | Bouches-du-Rhône | les | Bucco-Rhodaniens
    14 | Calvados | le | Calvadosiens
    15 | Cantal | le | Cantalous ou Cantaliens
    16 | Charente | la | Charentais
    17 | Charente-Maritime | la | Charentais ou Charentais-Maritimes
    18 | Cher | le | Berrichons
    19 | Corrèze | la | Corréziens
    20 | Corse-du-Sud | la | Corses du Sud
    21 | Haute-Corse | la | Corses du Nord
    22 | Côte-d'Or | la | Côtes-d'Oriens
    23 | Côtes d'Armor | les | Costarmoricains
    24 | Creuse | la | Creusois
    25 | Dordogne | la | Dordognais
    26 | Drôme | la | Drômois
    27 | Eure | l' | Eurois
    28 | Eure-et-Loire | l' | Euréliens
    29 | Finistère | le | Finistériens
    30 | Gard | le | Gardois
    31 | Haute-Garonne | la | Garonnais
    32 | Gers | le | Gersois
    33 | Gironde | la | Girondins
    34 | Hérault | l' | Héraultais
    35 | Ille-et-Vilaine | l' | Bretilliens
    36 | Indre | l' | Indrois
    37 | Indre-et-Loire | l' | Tourangeaux
    38 | Isère | l' | Isérois
    39 | Jura | le | Jurassiens
    40 | Landes | les | Landais
    41 | Loir-et-Cher | le | Loir-et-Chériens
    42 | Loire | la | Ligériens
    43 | Haute-Loire | la | Loirains
    44 | Loire-Atlantique | la | Loirains
    45 | Loiret | le | Loirétains
    46 | Lot | le | Lotois
    47 | Lot-et-Garonne | le | Lot-et-Garonnais
    48 | Lozère | la | Lozériens
    49 | Maine-et-Loire | la | habitants de Maine-et-Loire
    50 | Manche | la | Manchois
    51 | Marne | la | Marnais
    52 | Haute-Marne | la | Hauts-Marnais
    53 | Mayenne | la | Mayennais
    54 | Meurthe-et-Moselle | la | Meurthois
    55 | Meuse | la | Meusiens
    56 | Morbihan | le | Morbihannais
    57 | Moselle | la | Mosellans
    58 | Nièvre | la | Nivernais
    59 | Nord | le | Nordistes
    60 | Oise | l' | Oisiens
    61 | Orne | l' | Ornais
    62 | Pas-de-Calais | le | Pas-de-Calaisiens
    63 | Puy-de-Dôme | le | Puydomois
    64 | Pyrénées-Atlantiques | les | habitants des Pyrénées-Atlantiques
    65 | Hautes-Pyrénées | les | Hauts-Pyrénéens
    66 | Pyrénées-Orientales | les | habitants des Pyrénées-Orientales
    67 | Bas-Rhin | le | Bas-Rhinois
    68 | Haut-Rhin | le | Haut-Rhinois
    69 | Rhône | le | Rhodaniens
    70 | Haute-Saône | la | Haut-Saônois
    71 | Saône-et-Loire | la | Saône-et-Loiriens
    72 | Sarthe | la | Sarthois
    73 | Savoie | la | Savoyards
    74 | Haute-Savoie | la | Hauts-Savoyards
    75 | Paris | | Parisiens
    76 | Seine-Maritime | la | Seinomarins
    77 | Seine-et-Marne | la | Seine-et-Marnais
    78 | Yvelines | les | Yvelinois
    79 | Deux-Sèvres | les | Deux-Sévriens
    80 | Somme | la | Samariens
    81 | Tarn | le | Tarnais
    82 | Tarn-et-Garonne | le | Tarn-et-Garonnais
    83 | Var | le | Varois
    84 | Vaucluse | le | Vauclusiens
    85 | Vendée | la | Vendéens
    86 | Vienne | la | Viennois
    87 | Haute-Vienne | la | Hauts-Viennois
    88 | Vosges | les | Vosgiens
    89 | Yonne | l' | Yonnais
    90 | Territoire de Belfort | le | Terrifortains
    91 | Essonne | l' | Essoniens
    92 | Hauts-de-Seine | les | habitants des Hauts-de-Seine
    93 | Seine-Saint-Denis | la | Séquano-Dionysiens
    94 | Val-de-Marne | le | Val-de-Marnais
    95 | Val-d'Oise | le | Val-d'Oisiens
    `
		.split('\n')
		.filter((line) => Boolean(line.trim()))
		.map((line) => line.split(' | ').map((c) => c.trim()))
		.map(([code, nom, determinant, habitants]) => ({ code, nom, determinant, habitants }))
		.map((d) => ({ ...d, determinant: d.determinant.endsWith("'") ? 'l’' : d.determinant + ' ' }));

	return genders.find((d) => d.code === departementCode);
}
