import { env } from 'process';

const GITHUB_TOKEN = env.GITHUB_TOKEN;

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post({ body: { message } }) {
	const res = await fetch('https://api.github.com/repos/mquandalle/mesaidesvelo/issues', {
		method: 'POST',
		headers: {
			Authorization: `token ${GITHUB_TOKEN}`,
			'Content-Type': 'application/json',
			Accept: 'Accept: application/vnd.github.v3+json'
		},
		body: JSON.stringify({ title: 'Retour utilisateur', body: message })
	});

	return {
		status: res.status
	};
}
