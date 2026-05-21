<script module lang="ts">
	import { BIKE_KINDS } from '$lib/aides-velo-utils';
	import { engine, getEngine } from '$lib/engine';
	import type { RuleName } from 'aides-velo';
	import { formatValue, reduceAST, type Situation } from 'publicodes';
	import Emoji from './Emoji.svelte';

	// In case the formula involve a “linear operation” such as additions or
	// product, we cannot extract a fixed set a threshold and we need to display
	// a input of type number.
	const numberFieldRequired = Symbol('number field required');

	const collectivites = ['commune', 'intercommunalité', 'département', 'région', 'état'];
	const uniq = <T,>(arr: T[]) => [...new Set(arr)];

	const thresholdEngine = engine.shallowCopy();

	function setThresholdEngineSituation(
		localisationSituation: Situation<string>,
		publicodeSituation: Situation<string>,
	) {
		thresholdEngine.setSituation({
			...localisationSituation,
			// TODO: better handle `foyer . personnes` and more generally dependent
			// variables needed to compute the thresholds.
			'foyer . personnes': publicodeSituation['foyer . personnes'] ?? 1,
		});
	}

	function getOriginalNames(
		localisationSituation: Situation<string>,
		publicodeSituation: Situation<string>,
	): RuleName[] {
		if (Object.keys(localisationSituation).length === 0) {
			return [];
		}

		setThresholdEngineSituation(localisationSituation, publicodeSituation);

		return uniq(
			(BIKE_KINDS ?? [])
				.map(() => {
					return collectivites
						.map((collectivite) => {
							const aide = thresholdEngine.evaluate(`aides . ${collectivite}`);
							if (!aide.nodeValue) {
								return null;
							}

							// FIXME: Is it only a type error or this is a real issue?
							// @ts-ignore
							return aide.explanation.find(({ condition }) => condition.nodeValue === true)
								.consequence.name;
						})
						.filter(Boolean);
				})
				.flat(),
		) as RuleName[];
	}

	// We do a static analysis of the rules AST to search for a particular rule name.
	// When we find it in a comparaison expression we retrieve the value of the other
	// side of the expression.
	// For exemple in: applicable si: my . rule <= 400 €
	// We will retrieve [400]
	// We also need to handle mechanisms that are implemented using comparaisons such
	// as “grille” or “barème”.
	function findAllComparaisonsValue(
		dottedName: RuleName,
		{ searchedName, unit }: { searchedName: RuleName; unit: string },
	): Array<number | typeof numberFieldRequired> {
		const comparaisonOperators = ['<', '<=', '>', '>='];
		const linearOperatiors = ['-', '+', '*', '/'];

		// TODO: There might be a better way to convert a parsed node into a given unit.
		const convertValue = (node: any) => {
			const valeur = formatValue(thresholdEngine.evaluate(node));
			if (
				valeur === '∞' ||
				valeur === 'Non applicable' ||
				valeur === 'Pas encore défini' ||
				valeur === 'Erreur dans le calcul du nombre'
			) {
				return Infinity;
			}

			return thresholdEngine.evaluate({
				// NOTE: the formated value looks like "1 000,50" and we need to
				// convert it to "1000.50" to be able to parse it as a number. This is
				// a bit hacky but it works for now.
				valeur: valeur.replace(/\s/g, '').replace(/,/g, '.'),
				unité: unit,
			}).nodeValue;
		};

		const namesToFollow: RuleName[] = ['foyer . imposable', 'foyer . personnes'];

		const accumulateThresholds = (acc: any, node: any) => {
			if (acc === numberFieldRequired) {
				return acc;
			}

			if (node.nodeKind === 'grille' && node.explanation.assiette?.dottedName === searchedName) {
				const thresholds = node.explanation.tranches.map(({ plafond }: { plafond: any }) =>
					convertValue(plafond),
				);
				return [...acc, ...thresholds];
			} else if (
				node.nodeKind === 'operation' &&
				comparaisonOperators.includes(node.operationKind)
			) {
				if (node.explanation[0]?.dottedName === searchedName) {
					const value = convertValue(node.explanation[1]);
					return [...acc, value];
				} else if (node.explanation[1]?.dottedName === searchedName) {
					const value = convertValue(node.explanation[0]);
					return [...acc, value];
				}
			} else if (
				node.nodeKind === 'operation' &&
				linearOperatiors.includes(node.operationKind) &&
				(node.explanation[0]?.dottedName === searchedName ||
					node.explanation[1]?.dottedName === searchedName)
			) {
				return numberFieldRequired;
			} else if (node.nodeKind === 'reference' && namesToFollow.includes(node.name)) {
				// Following references like this is fragile. We could follow all references
				// but would need some special handling for the dependency on parent.
				return [...acc, ...findAllComparaisonsValue(node.dottedName, { searchedName, unit })];
			}
		};

		return reduceAST(accumulateThresholds, [], thresholdEngine.getRule(dottedName));
	}

	function findAllRevenuThresholds(
		names: RuleName[],
		localisationSituation: Situation<string>,
		publicodeSituation: Situation<string>,
	) {
		setThresholdEngineSituation(localisationSituation, publicodeSituation);

		return names.flatMap((name) =>
			findAllComparaisonsValue(name, {
				searchedName: 'revenu fiscal de référence par part',
				unit: '€/mois',
			}),
		);
	}
</script>

<script lang="ts">
	import { getSimulationForm } from '$lib/simulation/context.svelte';
	import { slide } from 'svelte/transition';
	import MultipleChoiceAnswer from './MultipleChoiceAnswer.svelte';
	import NumberField from './NumberField.svelte';

	type Props = {
		goals?: RuleName[];
	};

	let { goals = undefined }: Props = $props();
	const form = getSimulationForm();

	const engineBis = getEngine({});

	let originalNames = $derived(
		getOriginalNames(form.localisationSituation, form.publicodeSituation),
	);
	let thresholds = $derived(
		findAllRevenuThresholds(
			goals ?? originalNames,
			form.localisationSituation,
			form.publicodeSituation,
		),
	);

	let numberFieldIsRequired = $derived(
		thresholds.some((x) => x === numberFieldRequired || x === Infinity),
	);

	let uniqThresholds = $derived(
		numberFieldIsRequired
			? []
			: uniq(
					thresholds
						.filter((x): x is number => typeof x === 'number' && x !== Infinity)
						.map((x) => Math.round(x)),
				).sort((a, b) => a - b),
	);

	// Not all statically detected thresholds are impactful for the current computation
	// as some of them might be in inactive branches of the computation.
	// We evaluate all the thresholds and only keep the one that induce a change in the result.
	function removeUnecessaryThresholds(thresholds: number[]) {
		return [0, ...thresholds]
			.reduce(
				(acc, revenu) => {
					// TODO: we could optimize this calcul which is done 2
					// times : one time in DetailsLine and one time here
					engineBis.setSituation({
						...form.publicodeSituation,
						// 'vélo . type': `'${form.veloCat}'`,
						// 'maximiser les aides': 'oui',
						// NOTE: we want to show the RFRPP tresholds even if the
						// user is in a situation of handicap.
						'demandeur . en situation de handicap': 'non',
						'revenu fiscal de référence par part': `${revenu + 1} €/mois`,
					});

					// In some cases the total amount of aides will be the same
					// but the repartition will be different, exemple:
					// revenu 1 :  a 100, b 200  (total 300)
					// revenu 2 :  a 300         (total 300)
					// In this case we don't want to filter the threshold #182
					const aidesDisplayed = originalNames
						.map((dottedName) => engineBis.evaluate(dottedName).nodeValue ?? 0)
						.join('-');

					if (aidesDisplayed === acc.dernieresAidesDisplayed) {
						return acc;
					} else {
						return {
							thresholds: [...acc.thresholds, revenu],
							dernieresAidesDisplayed: aidesDisplayed,
						};
					}
				},
				{ thresholds: [] as number[], dernieresAidesDisplayed: null as string | null },
			)
			.thresholds.slice(1);
	}

	let displayedThresholds = $derived(
		numberFieldIsRequired
			? []
			: form.veloCat
				? removeUnecessaryThresholds(uniqThresholds)
				: uniqThresholds,
	);

	function setRevenuFiscal(value: string | number) {
		form.revenuFiscal = Number(value);
	}

	let showExplanations = $state(false);
</script>

{#if numberFieldIsRequired || displayedThresholds.length > 0}
	<div class="mt-6">
		<span class="text-sm font-bold text-[#263754]">
			Quel est votre revenu net mensuel (quotient familial) ?
		</span>
		<button
			type="button"
			title="Plus d'informations"
			class="ml-1 cursor-pointer align-middle opacity-75 hover:opacity-100"
			onclick={() => (showExplanations = !showExplanations)}
		>
			<Emoji className="align-middle" emoji="ℹ" />
		</button>
		{#if showExplanations}
			<p
				class="my-3 rounded-lg border border-[#dfe6ef] bg-[#fbfcfb] p-3 text-sm leading-6 text-[#647085] prose-sm"
				transition:slide={{ duration: 100 }}
			>
				Le montant des aides dépend de votre revenu par part de quotient familial. Sur votre avis
				d'imposition cela correspond au montant du « revenu fiscal de référence » divisé par le
				nombre de parts du quotient familial, puis divisé par 12.
			</p>
		{/if}
		<div class="mt-3 flex flex-wrap gap-2 playwright-revenuoptions">
			{#if numberFieldIsRequired}
				<NumberField
					bind:value={() => form.revenuFiscal, (value) => (form.revenuFiscal = value)}
					id="revenu-fiscal"
					unité="€"
				/>
			{:else}
				{#each displayedThresholds as threshold (threshold)}
					<MultipleChoiceAnswer
						value={threshold - 1}
						group={form.revenuFiscal ?? undefined}
						onSelect={setRevenuFiscal}
					>
						moins de <strong class="font-semibold">
							{formatValue(threshold)} €
						</strong>
					</MultipleChoiceAnswer>
				{/each}
				<MultipleChoiceAnswer
					value={displayedThresholds[displayedThresholds.length - 1] + 1}
					group={form.revenuFiscal ?? undefined}
					onSelect={setRevenuFiscal}
				>
					plus de <strong class="font-semibold">
						{formatValue(displayedThresholds[displayedThresholds.length - 1] + 1)} €
					</strong>
				</MultipleChoiceAnswer>
			{/if}
		</div>
	</div>
{/if}
