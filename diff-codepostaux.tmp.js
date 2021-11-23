const communesEtalab = await (
	await fetch('https://unpkg.com/@etalab/decoupage-administratif@0.9.0-0/data/communes.json')
).json();

const laPosteCSV = await fetch(
	'https://www.data.gouv.fr/fr/datasets/r/554590ab-ae62-40ac-8353-ee75162c05ee'
);
const communesLaPoste = (await laPosteCSV.text()).split('\n').reduce((acc, line) => {
	const [codeInsee, , codePostal] = line.split(';');
	acc[codeInsee] = (acc[codeInsee] ?? []).concat(codePostal);
	return acc;
}, {});

const diff = Object.fromEntries(
	communesEtalab
		.filter((c) => c.codesPostaux?.length >= 2)
		.map((c) => ({
			codeInsee: c.code,
			nom: c.nom,
			cpEtalab: c.codesPostaux,
			cpLaPoste: [...new Set(communesLaPoste[c.code] ?? [])]
		}))
		.filter((c) => [...c.cpEtalab].sort().join() !== [...c.cpLaPoste].sort().join())
		.map((c) => [c.codeInsee, c.cpLaPoste])
);

Deno.writeTextFileSync('./diff-codepostaux.json', JSON.stringify(diff, null, 2));
