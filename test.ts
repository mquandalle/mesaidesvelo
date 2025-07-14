import rules from '@betagouv/aides-velo/rules';
import Engine from 'publicodes';

const engine = new Engine(rules);

engine.setSituation({
	'localisation . epci': "'CC du Bassin de Pompey'",
});
engine.cache.traversedVariablesStack = [];
console.log(engine.evaluate('aides . bassin-pompey . plafond de ressources').missingVariables);
