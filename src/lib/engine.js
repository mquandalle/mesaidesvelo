import aidesVelo from '$lib/../aides.yaml';
import aidesRetrofit from '$lib/../../retrofit/aides.yaml';
import Publicodes from 'publicodes';

export const engine = new Publicodes(
	import.meta.env.VITE_SITE === 'aideretrofit.fr' ? aidesRetrofit : aidesVelo,
);

export function getEngine(situation) {
	const engineBis = engine.shallowCopy();
	engineBis.setSituation(situation ?? {});
	// HACK: traversedVariablesStack are removed from the public API, but still calculated if requested.
	// The way to ask the engine to compute traversedVariables is to initialize the stack with an empty array.
	// cf. https://github.com/publicodes/publicodes/issues/422 https://github.com/publicodes/publicodes/pull/432
	engineBis.cache.traversedVariablesStack = [];
	return engineBis;
}
