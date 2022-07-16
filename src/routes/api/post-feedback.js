import { env } from 'process';

const GITHUB_TOKEN = env.GITHUB_TOKEN;

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post({ request }) {
	const { message, page } = await request.json();
	const title = page === '/' ? `Retour utilisateur` : `Retour sur ${page.slice(1)}`;
	const body = `> Retour utilisateur effectué sur la page https://mesaidesvelo.fr${page} :\n\n${message}`;

	if (!GITHUB_TOKEN) {
		console.log(`Titre: ${title}`);
		console.log(`Message:\n${body}`);
		return { status: 200 };
	}

	const res = await fetch('https://api.github.com/repos/mquandalle/mesaidesvelo/issues', {
		method: 'POST',
		headers: {
			Authorization: `token ${GITHUB_TOKEN}`,
			'Content-Type': 'application/json',
			Accept: 'Accept: application/vnd.github.v3+json'
		},
		body: JSON.stringify({ title, body })
	});

	return { status: res.status };
}
