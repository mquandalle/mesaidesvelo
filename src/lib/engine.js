import Engine from 'publicodes';
import aidesRetrofit from '$lib/../../retrofit/aides.yaml';
import { AidesVeloEngine } from '@betagouv/aides-velo';

const IS_RETROFIT = import.meta.env.VITE_SITE === 'aideretrofit.fr';

const aidesVeloEngine = IS_RETROFIT ? undefined : new AidesVeloEngine();

export const engine = IS_RETROFIT ? new Engine(aidesRetrofit) : aidesVeloEngine.getEngine();

export const VELO_TYPES = IS_RETROFIT ? undefined : aidesVeloEngine.getOptions('vélo . type');

export function getEngine(situation) {
	const engineBis = engine.shallowCopy();
	engineBis.setSituation(situation ?? {});

	// NOTE: seems to be fixed
	// // HACK: avoid publicodes memory leak
	// // cf. https://github.com/publicodes/publicodes/issues/239
	// engine.subEngines = [];

	// HACK: traversedVariablesStack are removed from the public API, but still calculated if requested.
	// The way to ask the engine to compute traversedVariables is to initialize the stack with an empty array.
	// cf. https://github.com/publicodes/publicodes/issues/422 https://github.com/publicodes/publicodes/pull/432
	engineBis.cache.traversedVariablesStack = [];
	return engineBis;
}
