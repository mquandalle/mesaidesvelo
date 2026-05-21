import { AidesVeloEngine, type Questions } from 'aides-velo';

export const aidesVeloEngine = new AidesVeloEngine();

export const allAides = aidesVeloEngine.getAllAidesIn();

export const BIKE_KINDS = aidesVeloEngine.getOptions('vélo . type');

export function getOptions(questionName: keyof Questions) {
	return aidesVeloEngine.getOptions(questionName);
}

export type QuestionNames = keyof Questions;
