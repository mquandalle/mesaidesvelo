import { formatValue } from 'publicodes';

export const removeAccents = (str) => str?.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// First Google Search result, maybe there are better functions
export function slugify(str) {
	str = str.replace(/^\s+|\s+$/g, '');

	// Make the string lowercase
	str = removeAccents(str.toLowerCase());

	// Remove invalid chars
	str = str
		.replace(/[^a-z0-9 -]/g, '')
		// Collapse whitespace and replace by -
		.replace(/\s+/g, '-')
		// Collapse dashes
		.replace(/-+/g, '-');

	return str;
}

// TODO: To we really need this feature? Could we automatically infer descriptions from the formulas?
const defaultDescription = '';
export function formatDescription({ ruleName, engine, veloCat }) {
	const { rawNode } = engine.getRule(ruleName);
	const description = rawNode?.description ?? defaultDescription;
	const plafondRuleName = `${ruleName} . $plafond`;
	const plafondIsDefined = Object.keys(engine.getParsedRules()).includes(plafondRuleName);
	const plafond = plafondIsDefined && engine.evaluate(plafondRuleName);
	return description
		.replace(/\$vélo/g, veloCat === 'motorisation' ? 'kit de motorisation' : `vélo ${veloCat}`)
		.replace(/\$plafond/, formatValue(plafond?.nodeValue, { displayedUnit: '€' }));
}
