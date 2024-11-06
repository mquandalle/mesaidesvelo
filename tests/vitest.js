import { test, expect } from 'vitest';
import { data } from '@betagouv/aides-velo';

test.skip('content reference existing rules', () => {
	const content = import.meta.glob('../src/content/*.svx');
	const fileNames = Object.keys(content);
	const existingsRuleNames = Object.keys(data.aidesAvecLocalisation).map((dottedName) =>
		dottedName.toLowerCase(),
	);
	const inferedRuleNames = fileNames.map(
		(path) =>
			'aides . ' +
			path
				.split('/')
				.at(-1)
				.toLowerCase()
				.replace(/\.svx$/, ''),
	);

	inferedRuleNames.forEach((ruleName) => {
		expect(existingsRuleNames).toContain(ruleName);
	});
});
