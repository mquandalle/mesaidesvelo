export function removeFrenchAccents(str) {
	return str
		?.replace(/à/g, 'a')
		.replace(/è|é|ê|ë/g, 'e')
		.replace(/î|ï/g, 'i')
		.replace(/ô|ï/g, 'o')
		.replace(/œ/g, 'oe');
}

// First Google Search result, maybe there are better functions
export function slugify(str) {
	str = str.replace(/^\s+|\s+$/g, '');

	// Make the string lowercase
	str = removeFrenchAccents(str.toLowerCase());

	// Remove invalid chars
	str = str
		.replace(/[^a-z0-9 -]/g, '')
		// Collapse whitespace and replace by -
		.replace(/\s+/g, '-')
		// Collapse dashes
		.replace(/-+/g, '-');

	return str;
}
