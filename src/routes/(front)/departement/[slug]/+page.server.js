import aidesCollectivities from '$lib/data/aides-collectivities.json';
import { engine } from '$lib/engine';
import { slugify } from '$lib/utils';
import departements from '@etalab/decoupage-administratif/data/departements.json';
import regions from '@etalab/decoupage-administratif/data/regions.json';
import { error, redirect } from '@sveltejs/kit';
import classementVilleplus from '$lib/data/classement-villeplus.json';
import { _getCorrespondingContent } from '../../(search)/ville/[slug]/+page.server.js';

// https://www.insee.fr/fr/information/2114773#:~:text=TNCC%20%2D%20Type%20de%20nom%20en%20clair

const articlesDefinisTNCC = ['', '', 'le ', 'la ', 'les ', 'l’'];
const articlesPartitifsTNCC = ['de ', 'd’', 'du ', 'de la ', 'des ', 'de l’'];

export const _departementWithSlug = departements
	.filter(({ zone }) => zone === 'metro')
	.map((d) => ({ ...d, slug: slugify(d.nom) }))
	.filter((d) => d.slug !== 'paris');

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const slug = params.slug;
	const departement = _departementWithSlug.find((d) => slug === d.slug);

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

	const aideDepartementText = _getCorrespondingContent(aideDepartement);

	const aideRegion = Object.entries(aidesCollectivities).find(
		([, { collectivity }]) =>
			collectivity.kind === 'région' && collectivity.value === departement.region
	)?.[0];

	const aideRegionText = _getCorrespondingContent(aideRegion);

	const aidesLocales = Object.entries(aidesCollectivities)
		.filter(
			([, aide]) =>
				(aide.collectivity.kind === 'epci' || aide.collectivity.kind === 'code insee') &&
				aide.departement === departement.code
		)
		.map(([ruleName, { slug }]) => ({
			titre: engine.getRule(ruleName).rawNode.titre,
			slug,
		}));

	const classementVillePlus = {
		position: classementVilleplus.departements.findIndex((d) => d === departement.nom) + 1,
		total: classementVilleplus.departements.length,
	};

	return {
		departement: {
			...departement,
			nomHabitants: getNomHabitants(departement.code),
		},
		leDepartement: articlesDefinisTNCC[departement.typeLiaison] + departement.nom,
		duDepartement: articlesPartitifsTNCC[departement.typeLiaison] + departement.nom,
		region,
		aideDepartement,
		aideDepartementText,
		classementVillePlus,
		aideRegion,
		aideRegionText,
		aidesLocales,
	};
}

function getNomHabitants(departementCode) {
	const dataNomHabitants = `
    01 | Ain | Aindinois
    02 | Aisne | Axonais
    03 | Allier | Bourbonnais
    04 | Alpes-de-Haute-Provence | Bas-Alpins
    05 | Hautes-Alpes | Hauts-Alpins
    06 | Alpes-Maritimes | Maralpins
    07 | Ardèche | Ardéchois
    08 | Ardennes | Ardennais
    09 | Ariège | Ariégeois
    10 | Aube | Aubois
    11 | Aude | Audois
    12 | Aveyron | Aveyronnais
    13 | Bouches-du-Rhône | Bucco-Rhodaniens
    14 | Calvados | Calvadosiens
    15 | Cantal | Cantalous ou Cantaliens
    16 | Charente | Charentais
    17 | Charente-Maritime | Charentais ou Charentais-Maritimes
    18 | Cher | Berrichons
    19 | Corrèze | Corréziens
    20 | Corse-du-Sud | Corses du Sud
    21 | Haute-Corse | Corses du Nord
    22 | Côte-d'Or | Côtes-d'Oriens
    23 | Côtes d'Armor | Costarmoricains
    24 | Creuse | Creusois
    25 | Dordogne | Dordognais
    26 | Drôme | Drômois
    27 | Eure | Eurois
    28 | Eure-et-Loire | Euréliens
    29 | Finistère | Finistériens
    30 | Gard | Gardois
    31 | Haute-Garonne | Garonnais
    32 | Gers | Gersois
    33 | Gironde | Girondins
    34 | Hérault | Héraultais
    35 | Ille-et-Vilaine | Bretilliens
    36 | Indre | Indrois
    37 | Indre-et-Loire | Tourangeaux
    38 | Isère | Isérois
    39 | Jura | Jurassiens
    40 | Landes | Landais
    41 | Loir-et-Cher | Loir-et-Chériens
    42 | Loire | Ligériens
    43 | Haute-Loire | Loirains
    44 | Loire-Atlantique | Loirains
    45 | Loiret | Loirétains
    46 | Lot | Lotois
    47 | Lot-et-Garonne | Lot-et-Garonnais
    48 | Lozère | Lozériens
    49 | Maine-et-Loire | habitants de Maine-et-Loire
    50 | Manche | Manchois
    51 | Marne | Marnais
    52 | Haute-Marne | Hauts-Marnais
    53 | Mayenne | Mayennais
    54 | Meurthe-et-Moselle | Meurthois
    55 | Meuse | Meusiens
    56 | Morbihan | Morbihannais
    57 | Moselle | Mosellans
    58 | Nièvre | Nivernais
    59 | Nord | Nordistes
    60 | Oise | Oisiens
    61 | Orne | Ornais
    62 | Pas-de-Calais | Pas-de-Calaisiens
    63 | Puy-de-Dôme | Puydomois
    64 | Pyrénées-Atlantiques | habitants des Pyrénées-Atlantiques
    65 | Hautes-Pyrénées | Hauts-Pyrénéens
    66 | Pyrénées-Orientales | habitants des Pyrénées-Orientales
    67 | Bas-Rhin | Bas-Rhinois
    68 | Haut-Rhin | Haut-Rhinois
    69 | Rhône | Rhodaniens
    70 | Haute-Saône | Haut-Saônois
    71 | Saône-et-Loire | Saône-et-Loiriens
    72 | Sarthe | Sarthois
    73 | Savoie | Savoyards
    74 | Haute-Savoie | Hauts-Savoyards
    75 | Paris | Parisiens
    76 | Seine-Maritime | Seinomarins
    77 | Seine-et-Marne | Seine-et-Marnais
    78 | Yvelines | Yvelinois
    79 | Deux-Sèvres | Deux-Sévriens
    80 | Somme | Samariens
    81 | Tarn | Tarnais
    82 | Tarn-et-Garonne | Tarn-et-Garonnais
    83 | Var | Varois
    84 | Vaucluse | Vauclusiens
    85 | Vendée | Vendéens
    86 | Vienne | Viennois
    87 | Haute-Vienne | Hauts-Viennois
    88 | Vosges | Vosgiens
    89 | Yonne | Yonnais
    90 | Territoire de Belfort | Terrifortains
    91 | Essonne | Essoniens
    92 | Hauts-de-Seine | habitants des Hauts-de-Seine
    93 | Seine-Saint-Denis | Séquano-Dionysiens
    94 | Val-de-Marne | Val-de-Marnais
    95 | Val-d'Oise | Val-d'Oisiens  
    `
		.split('\n')
		.filter((line) => Boolean(line.trim()))
		.map((line) => line.split(' | ').map((c) => c.trim()))
		.map(([code, nom, nomHabitants]) => ({ code, nom, nomHabitants }));

	return dataNomHabitants.find((d) => d.code === departementCode).nomHabitants;
}
