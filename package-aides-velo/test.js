import test from 'ava';
import aidesVelo from 'aides-velo';

test('toutes les aides ont un titre et un lien', (t) => {
	aidesVelo().forEach((aide) => {
		t.truthy(aide.title, `${aide.id} a un titre`);
		t.truthy(aide.url, `${aide.id} a un lien`);
	});
});

test('liste des aides en France', (t) => {
	const list = aidesVelo({ 'localisation . pays': 'france' });
	t.assert(list.length > 50, 'au moins 50 aides en France');
	t.false(
		list.some(({ id: aideId }) => aideId.includes('. monaco') || aideId.includes('. luxembourg')),
		"pas d'aides de Monaco ou du Luxembourg"
	);
});

test('aides électrique colmar', (t) => {
	const colmarElectrique = aidesVelo({
		'localisation . code insee': '68066',
		'localisation . epci': '246800726',
		'localisation . département': '68',
		'localisation . région': '44',
		'vélo . type': 'électrique',
	});
	t.is(colmarElectrique.length, 3, '3 aides');
	t.truthy(
		colmarElectrique.find(({ title }) => title.toLowerCase().includes('colmar')),
		'Dont une de la ville'
	);
});

test('motorisation vélo bordeaux', (t) => {
	const bordeauxMotorisation = aidesVelo({
		'localisation . code insee': '33063',
		'localisation . epci': '243300316',
		'localisation . département': '33',
		'localisation . région': '75',
		'vélo . type': 'motorisation',
	}).filter(({ title }) => title.toLowerCase().includes('bordeaux'));
	t.is(bordeauxMotorisation.length, 1, '1 aide de la région');
	t.is(bordeauxMotorisation[0].amount, 100, '100 euros');
	t.deepEqual(
		bordeauxMotorisation[0].collectivity,
		{ kind: 'epci', value: 'Bordeaux Métropole', code: '243300316' },
		"Associée à l'EPCI de Bordeaux"
	);
});

test('prise en compte du revenu fiscal de référence', (t) => {
	const situationCharenton = {
		'localisation . code insee': '94018',
		'vélo . type': 'électrique',
		'aides . prime à la conversion': 'non',
	};
	const aidesCharenton = aidesVelo(situationCharenton);
	t.is(
		aidesCharenton.reduce((sum, { amount }) => sum + amount, 0),
		600,
		"jusqu'à 600 euros d'aides"
	);
	const aidesCharentonRevenuElevé = aidesVelo({
		...situationCharenton,
		'revenu fiscal de référence': '5000 €/mois',
	});
	t.is(
		aidesCharentonRevenuElevé.reduce((sum, { amount }) => sum + amount, 0),
		0,
		"pas d'aides pour un RFR à 5000 €/mois/part"
	);
});

test('interpolation des variables $vélo et $plafond', (t) => {
	aidesVelo({
		'localisation . pays': 'france',
		'localisation . code insee': '75056',
		'localisation . epci': '200054781',
		'localisation . département': '75',
		'localisation . région': '11',
		'vélo . type': 'électrique',
	}).forEach(({ id, description }) =>
		t.notRegex(
			description,
			/\$(vélo|plafond|ville)/,
			`variables interpolées dans la description de ${id}`
		)
	);
});
