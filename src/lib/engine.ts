import type Engine from 'publicodes';
import type { Situation } from 'publicodes';
import { aidesVeloEngine } from './aides-velo-utils';

export const engine: Engine = aidesVeloEngine.getEngine();

export function getEngine(situation: Situation<string>): Engine {
	const engineBis = engine.shallowCopy();
	engineBis.setSituation(situation ?? {});

	// HACK: avoid publicodes memory leak
	// cf. https://github.com/publicodes/publicodes/issues/239
	// NOTE: may no longer required with the new version of publicodes
	engine.context.subEngines = new Map();

	// HACK: traversedVariablesStack are removed from the public API, but still
	// calculated if requested. The way to ask the engine to compute
	// traversedVariables is to initialize the stack with an empty array. cf.
	// https://github.com/publicodes/publicodes/issues/422
	// https://github.com/publicodes/publicodes/pull/432
	engineBis.cache.traversedVariablesStack = [];
	return engineBis;
}
