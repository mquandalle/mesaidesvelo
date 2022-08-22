import aides from '$lib/../aides.yaml';
import Publicodes from 'publicodes';
import { derived } from 'svelte/store';
import { publicodeSituation } from './stores';

export const engine = new Publicodes(aides);

export const getCurrentBikeEngine = derived([publicodeSituation], ([$publicodeSituation]) => () => {
	engine.setSituation($publicodeSituation);
	return engine;
});

export const optionalEvaluate = (expression) => {
	if (typeof expression === 'string') {
		return expression;
	} else {
		return engine.evaluate(expression).nodeValue;
	}
};
