/** @type {import('./$types').PageLoad} */
export function load({ url, data }) {
	return { ...data, veloCat: url?.searchParams.get('velo') };
}
