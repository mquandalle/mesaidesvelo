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
