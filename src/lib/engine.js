import aides from '$lib/../aides.yaml';
import Publicodes from 'publicodes';

export const engine = new Publicodes(aides);

export function getEngine(situation) {
	const engineBis = engine.shallowCopy();
	engineBis.setSituation(situation ?? {});
	return engineBis;
}
