import { expect, test } from '@playwright/test';

const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:5173';

test.describe('Navigation scenarios', () => {
	test('simple navigation', async ({ page }) => {
		startNavigation(page, 'toulouse');

		await page.click("text=Achat d'un vélo électrique");
		const totalAides = page.locator('text=Total des aides >> ..');
		await expect(totalAides).toHaveText('Total des aides 450 €', { useInnerText: true });

		await page.click('text=moins de 1 567 €');
		await expect(totalAides).toHaveText('Total des aides 250 €', { useInnerText: true });

		await page.fill('input:below(label:text("Prix du vélo"))', '300');
		await expect(totalAides).toHaveText('Total des aides 100 €', { useInnerText: true });

		await page.fill('input:below(label:text("Prix du vélo"))', '');
		await page.click('text=moins de 1 567 €');
		await expect(totalAides).toHaveText('Total des aides 250 €', { useInnerText: true });
	});

	test('PMR scenario', async ({ page }) => {
		startNavigation(page, 'toulouse');

		await expect(page.locator("text=Achat d'un vélo adapté pour PMR")).toHaveCSS(
			'text-decoration-line',
			'line-through',
		);
		await page.click('text=Oui');
		await page.click("text=Achat d'un vélo adapté pour PMR");
		const totalAides = page.locator('text=Total des aides >> ..');
		await expect(totalAides).toHaveText('Total des aides 1 000 €');
	});

	test('age scenario', async ({ page }) => {
		startNavigation(page, 'sable-sur-sarthe');

		await page.click("text=Achat d'un vélo électrique");
		const totalAides = page.locator('text=Total des aides >> ..');
		await expect(totalAides).toHaveText('Total des aides 100 €', { useInnerText: true });

		await page.fill('input:below(label:text("Quel est votre âge ?"))', '15');
		expect(page.getByTestId('question-demandeur-age-value-15')).toBeTruthy();
		await expect(totalAides).toHaveText('Total des aides 0 €', { useInnerText: true });
		expect(page.getByTestId('question-demandeur-age-value-15')).toBeTruthy();
	});

	test('multiple choices scenario', async ({ page }) => {
		startNavigation(page, 'reims');

		await page.click("text=Achat d'un vélo électrique");
		const totalAides = page.locator('text=Total des aides >> ..');
		await expect(totalAides).toHaveText('Total des aides 450 €', { useInnerText: true });

		await page.click('text=Étudiant·e');
		await expect(totalAides).toHaveText('Total des aides 525 €', { useInnerText: true });

		await page.fill('input:below(label:text("Quel est votre âge ?"))', '15');
		expect(page.getByTestId('question-demandeur-age-value-15')).toBeTruthy();
		await expect(totalAides).toHaveText('Total des aides 525 €', { useInnerText: true });

		await page.click('text=Autre');
		await expect(totalAides).toHaveText('Total des aides 0 €', { useInnerText: true });
	});

	test('neuf/occasion scenario', async ({ page }) => {
		startNavigation(page, 'grenoble');

		await page.click("text=Achat d'un vélo mécanique simple");
		const totalAides = page.locator('text=Total des aides >> ..');
		await expect(totalAides).toHaveText('Total des aides 150 €', { useInnerText: true });

		await page.fill('input:below(label:text("Quel est le prix du vélo ?"))', '2000');
		await expect(totalAides).toHaveText('Total des aides 0 €', { useInnerText: true });

		await page.click('text=Occasion');
		await expect(totalAides).toHaveText('Total des aides 120 €', { useInnerText: true });
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

	await page.getByLabel('Oui').click();
	await expect(page.locator('text=aide non disponible')).toHaveCount(8);

	await page.goto(baseUrl + '/ville/charenton-le-pont?velo=électrique');
	await page.waitForTimeout(100);
	await expect(page.locator('.playwright-revenuoptions input[type=radio]')).toHaveCount(2);
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

async function startNavigation(page, ville) {
	await page.goto(baseUrl);

	await page.waitForLoadState();
	searchAndGoTo(page, ville);
	await expect(page).toHaveURL(baseUrl + '/ville/' + ville);

	// Hide evaporate animation
	await page.addStyleTag({
		content: '.evaporate { display: none !important; }',
	});
}

async function searchAndGoTo(page, commune) {
	await page.getByLabel('Localisation').first().fill(commune);
	await page.click('.autocomplete-list-item:first-child');
}
