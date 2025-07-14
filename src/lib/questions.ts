import type { RuleName } from '@betagouv/aides-velo';
import type { QuestionNames } from './aides-velo-utils';

export const QUESTIONS_TO_IGNORE: QuestionNames[] = [
	// Ignored as they are automatically resolved
	'localisation . ZFE',
	'localisation . epci',
	'localisation . pays',
	'localisation . région',
	'localisation . code insee',
	'localisation . département',
	'vélo . type',
	// Ignored as the 'revenu fiscal de référence par part' is
	// directly asked.
	'revenu fiscal de référence par part . nombre de parts',
	'revenu fiscal de référence par part . revenu de référence',
	// Not relevant to expose to the user, it's used for internal
	// computation.
	'vélo . état',
];

export const QUESTIONS_ORDER: RuleName[] = [
	// NOTE: this is no longer a question in the model as it's
	// computed from 'revenu fiscal de référence par part . revenu
	// de référence' 'revenu fiscal de référence par part . nombre
	// de parts'. However, to match the previous behavior, we ask
	// directly the question to the user, maybe we should change
	// this to ask separately the number of parts and the revenu.
	'foyer . personnes',
	'revenu fiscal de référence par part',
	'demandeur . en situation de handicap',
	'vélo . prix',
];
