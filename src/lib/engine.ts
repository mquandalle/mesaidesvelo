import Engine, { type Situation } from 'publicodes';
import { rules as aidesVelo } from '@betagouv/aides-velo';
// @ts-ignore
import aidesRetrofit from '$lib/../../retrofit/aides.yaml';
import { IS_RETROFIT } from './env';
import { aidesVeloEngine } from './aides-velo-utils';

export const engine: Engine = IS_RETROFIT
	? new Engine(aidesRetrofit)
	: aidesVeloEngine?.getEngine() ?? new Engine(aidesVelo);

export function getEngine(situation: Situation<string>): Engine {
	const engineBis = engine.shallowCopy();
	engineBis.setSituation(situation ?? {});

	// HACK: avoid publicodes memory leak
	// cf. https://github.com/publicodes/publicodes/issues/239
	// NOTE: may no longer required with the new version of publicodes
	engine.context.subEngines = new Map();

	// HACK: traversedVariablesStack are removed from the public API, but still calculated if requested.
	// The way to ask the engine to compute traversedVariables is to initialize the stack with an empty array.
	// cf. https://github.com/publicodes/publicodes/issues/422 https://github.com/publicodes/publicodes/pull/432
	engineBis.cache.traversedVariablesStack = [];
	return engineBis;
}
