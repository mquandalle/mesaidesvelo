import { data } from '@betagouv/aides-velo';
import { compile } from 'mdsvex';
import playwright from 'playwright-aws-lambda';
import template from './template.html?raw';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params: { slug } }) {
	// NOTE: communes may not be exported by the publicodes package in the
	// future.
	const ville = data.communes.find((c) => c.slug === slug);

	if (!ville) {
		throw error(404);
	}

	const localRuleName = Object.entries(data.aidesAvecLocalisation).find(
		([, { collectivity }]) =>
			(collectivity.kind === 'code insee' && collectivity.value === ville.code) ||
			(collectivity.kind === 'epci' && collectivity.value === ville.epci),
	)?.[0];

	const html = template.replace('{ville}', ville.nom).replace(
		'{logoImgSrc}',
		localRuleName &&
			// NOTE: should really be the publicodes package that provides this
			// information?
			data.miniatures[localRuleName]
			? `https://mesaidesvelo.fr/miniatures/${data.miniatures[localRuleName]}`
			: '',
	);
	const res = await compile(html);

	const browser = await playwright.launchChromium({ headless: true });
	const page = await browser.newPage({
		viewport: {
			width: 1200,
			height: 600,
		},
	});

	await page.setContent(res.code);
	const screenshot = await page.screenshot({ type: 'png' });
	await browser.close();

	// Set the s-maxage property which caches the images then on the Vercel edge
	const headers = new Headers();
	headers.append('Cache-Control', 's-maxage=31536000, stale-while-revalidate');
	headers.append('Content-Type', 'image/png');

	return new Response(screenshot, { headers });
}
