/** @type {import('./$types').PageLoad} */
export async function load({ url, data }) {
	const veloCat = url.searchParams.get('velo') ?? null;
	return { ...data, veloCat };
}
