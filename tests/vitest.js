import { test, expect } from 'vitest';
import aidesAndCollectivities from '$lib/data/aides-collectivities.json';

test('content reference existing rules', () => {
	const content = import.meta.glob('../src/content/*.svx');
	const fileNames = Object.keys(content);
	const existingsRuleNames = Object.keys(aidesAndCollectivities);
	const inferedRuleNames = fileNames.map(
		(path) =>
			'aides . ' +
			path
				.split('/')
				.at(-1)
				.replace(/\.svx$/, '')
	);

	inferedRuleNames.forEach((ruleName) => {
		expect(existingsRuleNames).toContain(ruleName);
	});
});
