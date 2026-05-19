import { page } from '$app/state';
import type { RuleName } from '@betagouv/aides-velo';
import {
	buildPublicodeSituation,
	isPersistingAnswer,
	localisationToSituation,
	parseVeloCat,
	type Answers,
	type Localisation,
	type SituationValue,
	veloTypeValue,
} from './situation';

export class SimulationState {
	private rememberedLocalisation = $state<Localisation | null>(null);
	private profileAnswers = $state<Answers>({});
	revenuFiscal = $state<number | null>(null);

	currentLocalisation = $derived((page.data?.ville as Localisation | undefined) ?? null);
	localisation = $derived(this.currentLocalisation);
	selectedLocalisation = $derived(this.currentLocalisation ?? this.rememberedLocalisation);
	veloCat = $derived.by(() => parseVeloCat(page.url.searchParams.get('velo')));
	veloTypeValue = $derived(veloTypeValue(this.veloCat));
	localisationSituation = $derived.by(() => localisationToSituation(this.localisation));

	rememberLocalisation(localisation: Localisation | null | undefined) {
		if (localisation) {
			this.rememberedLocalisation = localisation;
		}
	}

	clearRememberedLocalisation() {
		this.rememberedLocalisation = null;
	}

	getProfileAnswer(rule: RuleName) {
		return this.profileAnswers[rule];
	}

	getProfileAnswers(): Answers {
		return this.profileAnswers;
	}

	setProfileAnswer(rule: RuleName, value: SituationValue) {
		this.profileAnswers = setAnswer(this.profileAnswers, rule, value);
	}
}

export class SimulationFormState {
	private localAnswers = $state<Answers>({});

	constructor(readonly simulation: SimulationState) {}

	get answers(): Answers {
		return {
			...this.simulation.getProfileAnswers(),
			...this.localAnswers,
		};
	}

	get publicodeSituation() {
		return buildPublicodeSituation({
			localisationSituation: this.simulation.localisationSituation,
			answers: this.answers,
			revenuFiscal: this.simulation.revenuFiscal,
		});
	}

	get localisationSituation() {
		return this.simulation.localisationSituation;
	}

	get veloTypeValue() {
		return this.simulation.veloTypeValue;
	}

	get veloCat() {
		return this.simulation.veloCat;
	}

	get localisation() {
		return this.simulation.localisation;
	}

	get revenuFiscal() {
		return this.simulation.revenuFiscal;
	}

	set revenuFiscal(value: number | null | undefined) {
		this.simulation.revenuFiscal = value ?? null;
	}

	getAnswer(rule: RuleName) {
		return this.answers[rule];
	}

	setAnswer(rule: RuleName, value: SituationValue) {
		if (isPersistingAnswer(rule)) {
			this.simulation.setProfileAnswer(rule, value);
			return;
		}

		this.localAnswers = setAnswer(this.localAnswers, rule, value);
	}
}

function setAnswer(answers: Answers, rule: RuleName, value: SituationValue): Answers {
	if (value === null || value === undefined || value === '') {
		const { [rule]: _removed, ...nextAnswers } = answers;
		return nextAnswers;
	}

	return {
		...answers,
		[rule]: value,
	};
}
