<script>
	import { engine } from '$lib/engine';
	import { formatValue } from 'publicodes';
	import publicodesRules from '../../aides.yaml';

	export let aide;

	// The list in `velo . type` only contains primary kinds that can be used as
	// inputs in our UIs. But hte rule AST also reference some kinds “computed”
	// from the primary kind provided. We need to add them manually to the
	// search list. We associated them with a primary kind that can be used for
	// runtime evaluation.
	const veloKindsComputed = {
		mécanique: 'mécanique simple',
		'mécanique ou électrique': 'mécanique simple'
	};

	const getBikeKind = (kind) => veloKindsComputed[kind] ?? kind;

	const getMaximumAideForVeloKind = (kind) =>
		engine
			.setSituation({
				'localisation . code insee': `'${
					aide.collectivity.kind === 'région' ? '' : aide.codeInsee
				}'`,
				'localisation . epci': `'${
					aide.collectivity.kind === 'epci' ? aide.collectivity.value : ''
				}'`,
				'localisation . région': `'${
					aide.collectivity.kind === 'région' ? aide.collectivity.value : ''
				}'`,
				'localisation . département': `'${aide.departement}'`,
				'vélo . type': `'${getBikeKind(kind)}'`
			})
			.evaluate(aide.dottedName);

	const aidesPerVeloKind = publicodesRules['vélo . type'].possibilités
		.map((kind) => [kind, getMaximumAideForVeloKind(kind)])
		.filter(([, max]) => max.nodeValue !== null && max.nodeValue !== 0);

	// TODO: this list is hacky
	const compactionOptions = [
		{
			keys: ['électrique', 'cargo électrique', 'cargo', 'mécanique simple', 'pliant'],
			remplace: 'mécanique ou électrique'
		},
		{
			keys: ['électrique', 'cargo électrique'],
			remplace: 'électrique'
		},
		{
			keys: ['pliant', 'mécanique simple', 'cargo'],
			remplace: 'mécanique'
		},
		{
			keys: ['pliant', 'mécanique simple'],
			remplace: 'mécanique'
		},
		{
			keys: ['cargo', 'cargo électrique'],
			remplace: 'cargo'
		},
		{
			keys: ['mécanique simple'],
			remplace: 'mécanique'
		}
	];

	const compactAidesList = (aidesList) => {
		let res = Object.fromEntries(aidesList);
		for (let { keys, remplace } of compactionOptions) {
			if (keys.every((key) => res[key] && res[key].nodeValue === res[keys[0]].nodeValue)) {
				res = Object.fromEntries([
					...Object.entries(res).filter(([key]) => !keys.includes(key)),
					[remplace, res[keys[0]]]
				]);
			}
		}
		return Object.entries(res);
	};
</script>

<a href="/ville/{aide.slug}" class="hover:text-green-700"
	>{aide.rawNode.titre.replace(/région/i, '').trim()}</a
>
<a
	href={aide.rawNode.lien}
	target="_blank"
	rel="nofollow"
	title="Site officiel"
	class="text-xs inline-block ml-2 !font-normal !no-underline border px-1 rounded bg-gray-50 hover:bg-green-100"
	>site officiel</a
><br />
<div class="inline-block text-xs text-gray-600">
	{#each compactAidesList(aidesPerVeloKind).sort(([, maxA], [, maxB]) => maxA.nodeValue - maxB.nodeValue) as [kind, maximumAide]}
		<div class="inline-block not-last:border-r border-gray-300 mr-2 pr-2 last:mr-0">
			{kind}
			<a
				href="/ville/{aide.slug}?velo={getBikeKind(kind)}"
				class="inline-block pl-1 !no-underline !text-gray-700 !hover:text-green-600"
				>{formatValue(maximumAide)}</a
			>
		</div>
	{/each}
</div>
