import { AidesVeloEngine } from '@betagouv/aides-velo';

export const aidesVeloEngine = new AidesVeloEngine();

// export function getEngine(situation: Questions): AidesVeloEngine {
// 	const engineBis = engine.shallowCopy();
// 	engineBis.setSituation(situation ?? {});
//
// 	// NOTE: seems to be fixed
// 	// // HACK: avoid publicodes memory leak
// 	// // cf. https://github.com/publicodes/publicodes/issues/239
// 	// engine.subEngines = [];
//
// 	// HACK: traversedVariablesStack are removed from the public API, but still calculated if requested.
// 	// The way to ask the engine to compute traversedVariables is to initialize the stack with an empty array.
// 	// cf. https://github.com/publicodes/publicodes/issues/422 https://github.com/publicodes/publicodes/pull/432
// 	engineBis.cache.traversedVariablesStack = [];
// 	return engineBis;
// }
