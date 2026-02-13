// Script pour ajouter les slugs aux données de communes et aides-collectivities
// Ce script remplace associate-collectivities.js et transform-communes-data.js
// en se concentrant uniquement sur la génération des slugs

import { slugify } from '../lib/utils.js';
import { writeJsonData } from './writeData.js';

import aidesCollectivities from '@betagouv/aides-velo/data/aides-collectivities.json' with { type: 'json' };
import communes from '@betagouv/aides-velo/data/communes.json' with { type: 'json' };

// ===== Traitement des communes =====

// Identifier les noms de communes en doublon pour ajouter le département au slug
const duplicateCommunesNames = communes
	.map(({ nom }) => slugify(nom))
	.sort()
	.reduce((acc, cur, i, arr) => {
		if (cur === arr[i - 1] && cur !== acc[acc.length - 1]) {
			acc.push(cur);
		}
		return acc;
	}, []);

// Ajouter les slugs aux communes
const communesWithSlugs = communes.map((commune) => ({
	...commune,
	slug:
		slugify(commune.nom) +
		(duplicateCommunesNames.includes(slugify(commune.nom))
			? `-${commune.departement ?? commune.code.slice(0, 2)}`
			: ''),
}));

// ===== Traitement des aides-collectivities =====

// Trier les communes par population pour trouver le chef-lieu le plus peuplé
const communesSorted = communesWithSlugs.sort((a, b) => b.population - a.population);

// Trouver le slug de la commune associée à une aide
const getSlugForAide = (aide) => {
	// Si un codeInsee est défini, on l'utilise directement
	if (aide.codeInsee) {
		const commune = communesSorted.find(({ code }) => code === aide.codeInsee);
		return commune?.slug;
	}

	// Sinon, on essaie de trouver la commune via le collectivity
	if (!aide.collectivity) {
		return undefined;
	}

	const { kind, value } = aide.collectivity;

	// Pour les EPCI, on trouve la commune la plus peuplée de cet EPCI
	if (kind === 'epci') {
		const commune = communesSorted.find(({ epci }) => epci === value);
		return commune?.slug;
	}

	// Pour les autres types, on ne peut pas déterminer le slug
	return undefined;
};

// Ajouter les slugs aux aides-collectivities
const aidesCollectivitiesWithSlugs = Object.fromEntries(
	Object.entries(aidesCollectivities).map(([ruleName, aide]) => [
		ruleName,
		{
			...aide,
			slug: getSlugForAide(aide),
		},
	]),
);

// ===== Écriture des fichiers =====

writeJsonData('communes.json', communesWithSlugs);
writeJsonData('aides-collectivities.json', aidesCollectivitiesWithSlugs);

console.log('✅ Slugs ajoutés avec succès !');
console.log(`   - ${communesWithSlugs.length} communes`);
console.log(`   - ${Object.keys(aidesCollectivitiesWithSlugs).length} aides`);
