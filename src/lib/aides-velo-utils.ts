import { AidesVeloEngine, type Questions } from '@betagouv/aides-velo';
import { IS_RETROFIT } from './env';

export const aidesVeloEngine = IS_RETROFIT ? undefined : new AidesVeloEngine();

export const allAides = IS_RETROFIT ? [] : aidesVeloEngine?.getAllAidesIn();

export const BIKE_KINDS = IS_RETROFIT ? [] : aidesVeloEngine?.getOptions('vélo . type');

export function getOptions(questionName: keyof Questions) {
	return IS_RETROFIT ? [] : aidesVeloEngine?.getOptions(questionName);
}

export type QuestionNames = keyof Questions;
