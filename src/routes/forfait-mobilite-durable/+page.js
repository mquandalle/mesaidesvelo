export async function load({ fetch }) {
	const defaultEntreprises = await fetch('/api/entreprises');
	return { entreprises: await defaultEntreprises.json() };
}
