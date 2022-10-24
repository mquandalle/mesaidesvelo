import aidesVelo from '$lib/../aides.yaml';
import aidesRetrofit from '$lib/../../retrofit/aides.yaml';
import Publicodes from 'publicodes';

export const engine = new Publicodes(
	import.meta.env.VITE_SITE === 'aideretrofit.fr' ? aidesRetrofit : aidesVelo
);

export function getEngine(situation) {
	const engineBis = engine.shallowCopy();
	engineBis.setSituation(situation ?? {});
	return engineBis;
}
