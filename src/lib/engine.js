import aides from '$lib/../aides.yaml';
import Publicodes from 'publicodes';
import { derived } from 'svelte/store';
import { publicodeSituation } from './stores';

export const engine = new Publicodes(aides);

const currentBikeEngineInstance = engine.shallowCopy();

export const getCurrentBikeEngine = derived([publicodeSituation], ([$publicodeSituation]) => {
	currentBikeEngineInstance.setSituation($publicodeSituation);
	return currentBikeEngineInstance;
});
