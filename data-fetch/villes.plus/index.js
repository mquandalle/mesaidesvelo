import epci from '@etalab/decoupage-administratif/data/epci.json' assert { type: 'json' };
import { slugify } from '../../src/lib/utils.js';
import { writeJsonData } from '../../src/scripts/writeData.js';

// TODO: récupérer ce classement depuis le dépôt ville.plus
const rawClassement = `
Eurométropole de Strasbourg
Bordeaux Métropole
Toulouse Métropole
Montpellier Méditerranée Métropole
Orléans Métropole
Grenoble-Alpes Métropole
Rennes Métropole
Tours Métropole Val de Loire
Nantes Métropole
Clermont Auvergne Métropole
Métropole de Lyon
Métropole du Grand Nancy
Métropole du Grand Paris
Métropole Européenne de Lille
Brest Métropole
Métropole Rouen Normandie
Metz Métropole
Aix-Marseille-Provence
Nice Côte d'Azur
Saint-Étienne Métropole
`;

const normalizedEpciNames = rawClassement
	.split('\n')
	.filter((l) => Boolean(l.trim()))
	.map((line) => epci.find(({ nom }) => slugify(nom).includes(slugify(line)))?.nom);

writeJsonData('classement-villeplus.json', normalizedEpciNames);
