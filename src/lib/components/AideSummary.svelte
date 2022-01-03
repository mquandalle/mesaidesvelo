<script>
	import { engine } from '$lib/engine';
	import { formatValue, reduceAST } from 'publicodes';
	import publicodesRules from '../../aides.yaml';

	export let aide;

	// The list in `velo . type` only contains primary kinds that can be used as
	// inputs in our UIs. But hte rule AST also reference some kinds “computed”
	// from the primary kind provided. We need to add them manually to the
	// search list. We associated them with a primary kind that can be used for
	// runtime evaluation.
	const veloKindsComputed = {
		mécanique: 'mécanique simple',
		'électrique ou mécanique': 'mécanique simple'
	};

	const veloKinds = [
		...publicodesRules['vélo . type'].possibilités,
		...Object.keys(veloKindsComputed)
	].map((kind) => `vélo . ${kind}`);

	const extractVeloKindsFromAst = (rule) =>
		reduceAST(
			(acc, node) => {
				if (node.nodeKind === 'rule') {
					return extractVeloKindsFromAst(node.explanation.valeur);
				} else if (node.nodeKind === 'reference') {
					if (veloKinds.includes(node.dottedName)) {
						return acc.add(node.dottedName.replace('vélo . ', ''));
					} else if (node.dottedName.startsWith('aides . ')) {
						return new Set([...acc, ...extractVeloKindsFromAst(engine.getRule(node.dottedName))]);
					}
				} else if (node.visualisationKind === 'replacement') {
					return acc;
				}
			},
			new Set(),
			rule
		);

	const getBikeKind = (kind) => veloKindsComputed[kind] ?? kind;

	const getMaximumAideForVeloKind = (kind) =>
		formatValue(
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
					'localisation . département': `'${aide.codeInsee.slice(0, 2)}'`,
					'vélo . type': `'${getBikeKind(kind)}'`
				})
				.evaluate(aide.dottedName)
		);
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
	{#each Array.from(extractVeloKindsFromAst(aide)) as kind}
		<div class="inline-block not-last:border-r border-gray-300 px-2 first:pl-0">
			{kind}
			<a
				href="/ville/{aide.slug}?velo={getBikeKind(kind)}"
				class="inline-block pl-1 !no-underline !text-gray-700 !hover:text-green-600"
				>{getMaximumAideForVeloKind(kind)}</a
			>
		</div>
	{/each}
</div>
