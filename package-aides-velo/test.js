import test from 'ava';
import aidesVelo from 'aides-velo';

test('aides électrique colmar', (t) => {
	const colmarElectrique = aidesVelo({
		'localisation . code insee': '68066',
		'localisation . epci': 'CA Colmar Agglomération',
		'localisation . département': '68',
		'localisation . région': '44',
		'vélo . type': 'électrique'
	});
	t.is(colmarElectrique.length, 2, '2 aides');
	t.truthy(
		colmarElectrique.find(({ title }) => title.toLowerCase().includes('colmar')),
		'Dont une de la ville'
	);
});

test('motorisation vélo strasboug', (t) => {
	const strasbourgMotorisation = aidesVelo({
		'localisation . code insee': '67482',
		'localisation . epci': 'Eurométropole de Strasbourg',
		'localisation . département': '67',
		'localisation . région': '44',
		'vélo . type': 'motorisation'
	});
	t.is(strasbourgMotorisation.length, 1, '1 aide de la ville');
	t.is(strasbourgMotorisation[0].amount, 150, '150 euros');
});
