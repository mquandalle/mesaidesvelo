import { BIKE_KINDS } from '$lib/aides-velo-utils';
import type { Questions, RuleName } from '@betagouv/aides-velo';
import type { Situation } from 'publicodes';

export type Localisation = {
	nom: string;
	slug: string;
	codeInsee: string;
	codePostal?: string;
	epci?: string;
	zfe?: boolean;
	departement: string;
	region: string;
	pays?: string;
};

export type SituationValue = string | number | boolean | null | undefined;
export type Answers = Partial<Record<RuleName, SituationValue>>;
export type BikeKind = Questions['vélo . type'];

export const PERSISTING_ANSWERS: RuleName[] = [
	'demandeur . en situation de handicap',
	'foyer . personnes',
];

export function isPersistingAnswer(rule: RuleName) {
	return PERSISTING_ANSWERS.includes(rule);
}

export function parseVeloCat(value: string | null): BikeKind | undefined {
	return (BIKE_KINDS ?? []).includes(value as BikeKind) ? (value as BikeKind) : undefined;
}

export function veloTypeValue(veloCat: BikeKind | undefined): string | null {
	return veloCat ? `'${veloCat}'` : null;
}

export function localisationToSituation(localisation: Localisation | null): Situation<string> {
	return localisation
		? {
				'localisation . code insee': `'${localisation.codeInsee}'`,
				'localisation . epci': `'${localisation.epci || ''}'`,
				'localisation . ZFE': `${localisation.zfe ? 'oui' : 'non'}`,
				'localisation . département': `'${localisation.departement}'`,
				'localisation . région': `'${localisation.region}'`,
			}
		: {};
}

export function compactAnswers(answers: Answers): Situation<string> {
	return Object.fromEntries(
		Object.entries(answers).filter(([, value]) => value !== null && value !== undefined && value !== ''),
	) as Situation<string>;
}

export function buildPublicodeSituation({
	localisationSituation,
	answers,
	revenuFiscal,
}: {
	localisationSituation: Situation<string>;
	answers: Answers;
	revenuFiscal: number | null | undefined;
}): Situation<string> {
	return {
		...localisationSituation,
		...compactAnswers(answers),
		...(revenuFiscal
			? { 'revenu fiscal de référence par part': `${revenuFiscal} €/mois` }
			: {}),
	};
}
