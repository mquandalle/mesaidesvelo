import { test, expect } from '@playwright/test';

const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:5173';

test.describe('Navigation scenarios', () => {
	test('simple navigation', async ({ page }) => {
		await page.goto(baseUrl);

		await page.waitForLoadState();
		searchAndGoTo(page, 'toulou');
		await expect(page).toHaveURL(baseUrl + '/ville/toulouse');

		// Hide evaporate animation
		await page.addStyleTag({
			content: '.evaporate { display: none !important; }',
		});

		await page.click("text=Achat d'un vélo électrique");
		const totalAides = page.locator('text=Total des aides >> ..');
		await expect(totalAides).toHaveText('Total des aides 850 €', { useInnerText: true });

		await page.click('text=moins de 1 567 €');
		await expect(totalAides).toHaveText('Total des aides 250 €', { useInnerText: true });

		await page.fill('input:below(label:text("Prix du vélo"))', '300');
		await expect(totalAides).toHaveText('Total des aides 100 €', { useInnerText: true });

		await page.fill('input:below(label:text("Prix du vélo"))', '');
		await expect(totalAides).toHaveText('Total des aides 250 €', { useInnerText: true });

		await page.goBack();
		await page.click('text=Prime à la conversion');
		expect(page.locator('text=prime à la casse')).toBeTruthy();
		expect(page.locator('text=3 000 €')).toBeTruthy();
	});

	test('PMR scenario', async ({ page }) => {
		await page.goto(baseUrl);

		await page.waitForLoadState();
		searchAndGoTo(page, 'toulou');
		await expect(page).toHaveURL(baseUrl + '/ville/toulouse');

		// Hide evaporate animation
		await page.addStyleTag({
			content: '.evaporate { display: none !important; }',
		});

		await page.click("text=Achat d'un vélo adapté pour PMR");
		const totalAides = page.locator('text=Total des aides >> ..');
		await expect(totalAides).toHaveText('Total des aides 2 000 €');

		const bonusVelo = page.locator('text=Bonus vélo 2 000 €');
		await expect(bonusVelo).not.toBeEmpty();

		await page.click('text=plus de 2 922 €');
		await expect(totalAides).toHaveText('Total des aides 0 €', { useInnerText: true });

		await page.getByLabel('Oui').click();
		await expect(totalAides).toHaveText('Total des aides 3 000 €', { useInnerText: true });
	});

	test('age scenario', async ({ page }) => {
		await page.goto(baseUrl);

		await page.waitForLoadState();
		searchAndGoTo(page, 'toulou');
		await expect(page).toHaveURL(baseUrl + '/ville/toulouse');

		// Hide evaporate animation
		await page.addStyleTag({
			content: '.evaporate { display: none !important; }',
		});

		await page.click("text=Achat d'un vélo électrique");
		const totalAides = page.locator('text=Total des aides >> ..');
		await expect(totalAides).toHaveText('Total des aides 850 €', { useInnerText: true });

		await page.fill('input:below(label:text("Quel est votre âge ?"))', '15');
		expect(page.getByTestId('question-demandeur-age-value-15')).toBeTruthy();
		await expect(totalAides).toHaveText('Total des aides 450 €', { useInnerText: true });

		await page.click('text=plus de 2 922 €');
		await expect(totalAides).toHaveText('Total des aides 0 €', { useInnerText: true });
		expect(page.getByTestId('question-demandeur-age-value-15')).toBeTruthy();

		await page.click('text=moins de 592 €');
		await expect(totalAides).toHaveText('Total des aides 450 €', { useInnerText: true });

		await page.fill('input:below(label:text("Quel est votre âge ?"))', '25');
		await expect(totalAides).toHaveText('Total des aides 850 €', { useInnerText: true });
		expect(page.getByTestId('question-demandeur-age-value-25')).toBeTruthy();
	});
});

test('Liste aides do not crash', async ({ page }) => {
	await page.goto(baseUrl + '/liste-aides');
	await expect(page.locator('h1')).toHaveText('Les aides intégrées sur le site');
});

test('Aide not available', async ({ page }) => {
	await page.goto(baseUrl + '/ville/landerneau');
	await expect(page.locator("text=motorisation d'un vélo classique")).toHaveCSS(
		'text-decoration-line',
		'line-through',
	);
});

test('Revenu of type number', async ({ page }) => {
	await page.goto(baseUrl + '/ville/crolles?velo=électrique');
	expect(page.locator('input[type=number][id=revenu-fiscal]')).toBeTruthy();
});

test('Thumbnail displayed', async ({ page }) => {
	await page.goto(baseUrl + '/ville/albi?velo=cargo');
	expect(page.locator('img[alt="Logo grand albigeois"]')).toBeTruthy();
});

test('Revenu selector', async ({ page }) => {
	await page.goto(baseUrl + '/ville/bordeaux');
	await page.waitForTimeout(500);
	await page.click('text=plus de 2 076 €');

	await expect(page.locator('text=aide non disponible')).toHaveCount(8);

	await page.goto(baseUrl + '/ville/charenton-le-pont?velo=électrique');
	await page.waitForTimeout(100);
	await expect(page.locator('.playwright-revenuoptions input[type=radio]')).toHaveCount(3);
});

test('New or second hand bike', async ({ page }) => {
	await page.goto(baseUrl + '/ville/toulouse?velo=électrique');
	expect(page.locator("text=neuf ou d'occasion ?")).toBeTruthy();

	await page.goto(baseUrl + '/ville/lyon?velo=mécanique simple');
	expect(page.locator("text=uniquement pour l'achat d'un vélo d'occasion")).toBeTruthy();

	await page.goto(baseUrl + '/ville/lyon?velo=électrique');
	expect(page.locator("text=uniquement pour l'achat d'un vélo neuf")).toBeTruthy();

	await page.goto(baseUrl + '/ville/pantin?velo=mécanique simple');
	expect(page.locator("text=pour un vélo neuf ou un vélo d'occasion")).toBeTruthy();
});

test('Text generation', async ({ page }) => {
	await page.goto(baseUrl + '/ville/landerneau');
	expect(page.locator("text=Malheureusement il n'existe aucune aide locale")).toBeTruthy();
});

// FIXME: This test is not working although it works in the browser
// test('Redirection from details', async ({ page }) => {
// 	await page.goto(baseUrl + '/ville/toulouse?velo=électrique');
// 	expect(page.locator('text=Total des aides')).toBeTruthy();
// 	expect(page.locator('text=Toulouse')).toBeTruthy();
//
// 	searchAndGoTo(page, 'Montpellier');
// 	await page.waitForURL(baseUrl + '/ville/montpellier');
// 	await expect(page).toHaveURL(baseUrl + '/ville/montpellier');
// 	console.log(await page.locator('text=Toulouse').allTextContents());
// 	expect(page.locator('text=Toulouse')).not.toBeTruthy();
// });

async function searchAndGoTo(page, commune) {
	await page.getByLabel('Localisation').first().fill(commune);
	await page.click('.autocomplete-list-item:first-child');
}
