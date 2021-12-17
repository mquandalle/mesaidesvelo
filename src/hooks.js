/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ request, resolve }) {
	// HACK: Building the indexed data for fuzzy search takes some when the
	// following file is imported. Instead of deferring the import when we need
	// it in the search endpoint, we asynchronously import it from any any
	// request to start this process earlier and reduce perceived latency.
	import('$lib/indexed-data-communes');

	return await resolve(request);
}
