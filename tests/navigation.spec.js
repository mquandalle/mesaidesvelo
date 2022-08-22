import { test, expect } from '@playwright/test';

const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:5173';

test('Navigation scenario', async ({ page }) => {
	await page.goto(baseUrl);

	await page.click('[placeholder*="Commune"]');
	await page.fill('[placeholder*="Commune"]', 'toulou');
	await page.click('.autocomplete-list-item:first-child');
	await expect(page).toHaveURL(baseUrl + '/ville/toulouse');

	// Hide evaporate animation
	await page.addStyleTag({
		content: '.evaporate { display: none !important; }'
	});

	await page.click('text=Achat d’un vélo électrique');
	const totalAides = page.locator('text=Total des aides >> ..');
	await expect(totalAides).toHaveText('Total des aides 900 €', { useInnerText: true });

	await page.click('text=moins de 1 567 €');
	await expect(totalAides).toHaveText('Total des aides 500 €', { useInnerText: true });

	await page.fill('input:below(label:text("Prix du vélo"))', '300');
	await expect(totalAides).toHaveText('Total des aides 250 €', { useInnerText: true });

	await page.fill('input:below(label:text("Prix du vélo"))', '');
	await expect(totalAides).toHaveText('Total des aides 500 €', { useInnerText: true });

	await page.goBack();
	await page.click('text=Prime à la conversion');
	await expect(page.locator('text=prime à la casse')).toBeTruthy();
});

test('Liste aides do not crash', async ({ page }) => {
	await page.goto(baseUrl + '/liste-aides');
	await expect(page.locator('h1')).toHaveText('Les aides intégrées sur le site');
});

test('Aide not available', async ({ page }) => {
	await page.goto(baseUrl + '/ville/landerneau');
	await expect(page.locator('text=motorisation d’un vélo classique')).toHaveCSS(
		'text-decoration-line',
		'line-through'
	);
});

test('Revenu of type number', async ({ page }) => {
	await page.goto(baseUrl + '/ville/crolles?velo=électrique');
	await expect(page.locator('input[type=number][id=revenu-fiscal]')).toBeTruthy();
});

test('Thumbnail displayed', async ({ page }) => {
	await page.goto(baseUrl + '/ville/albi?velo=cargo');
	await expect(page.locator('img[alt="Logo grand albigeois"]')).toBeTruthy();
});

test('Revenu selector', async ({ page }) => {
	await page.goto(baseUrl + '/ville/bordeaux');
	await page.waitForTimeout(100);
	await page.click('text=plus de 2 201 €');
	await expect(page.locator('text=aide non disponible')).toHaveCount(6);

	await page.goto(baseUrl + '/ville/charenton-le-pont?velo=électrique');
	await page.waitForTimeout(100);
	await expect(page.locator('.playwright-revenuoptions input[type=radio]')).toHaveCount(4);
});

test('New or second hand bike', async ({ page }) => {
	await page.goto(baseUrl + '/ville/toulouse?velo=électrique');
	await expect(page.locator('text=neuf ou d’occasion ?')).toBeTruthy();

	await page.goto(baseUrl + '/ville/lyon?velo=mécanique simple');
	await expect(page.locator('text=uniquement pour l’achat d’un vélo d’occasion')).toBeTruthy();

	await page.goto(baseUrl + '/ville/lyon?velo=électrique');
	await expect(page.locator('text=uniquement pour l’achat d’un vélo neuf')).toBeTruthy();

	await page.goto(baseUrl + '/ville/pantin?velo=mécanique simple');
	await expect(page.locator('text=pour un vélo neuf ou un vélo d’occasion')).toBeTruthy();
});

test('Text generation', async ({ page }) => {
	await page.goto(baseUrl + '/ville/landerneau');
	await expect(page.locator('text=Malheureusement il n’existe aucune aide locale')).toBeTruthy();
});
