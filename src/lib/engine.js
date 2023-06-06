import aidesVelo from '$lib/../aides.yaml';
import aidesRetrofit from '$lib/../../retrofit/aides.yaml';
import Engine from 'publicodes';

export const engine = new Engine(
	import.meta.env.VITE_SITE === 'aideretrofit.fr' ? aidesRetrofit : aidesVelo
);

export function getEngine(situation) {
	const engineBis = engine.shallowCopy();
	engineBis.setSituation(situation ?? {});
	return engineBis;
}
