# Mesaidesvelo.fr

### Puis-je bénéficier d’aides pour acheter un vélo ?

De nombreuses villes proposent des aides à l’achat de vélos. Leur objectif est d’encourager l'usage du vélo sur leur territoire. Il existe aussi des aides au niveau du département, de la région ainsi qu’au niveau national.

Les modalités de ces aides sont variées, elles sont parfois cumulables et parfois pas, parfois conditonnés à un niveau de revenus et d'autres fois ouvertes à tous, etc.

**Mesaidesvelo.fr** rassemble toutes les aides existantes et permet d’en estimer le montant rapidement et simplement.

### Comment contribuer ?

Vous avez identifié une erreur ou une aide que nous ne prennons pas en compte ? N’hesitez pas à ouvrir un ticket sur GitHub !

Si vous êtes développeur vous pouvez aussi améliorer l’application. Il s'agit d’une application JavaScript, utilisant [Svelte Kit](https://kit.svelte.dev) et [Windi.css](https://windicss.org) pour l’interface.

Pour lancer l'application en mode développement utilisez les commandes suivntes :

```sh
npm install
npm run dev
```

Les aides utilisent le langage [Publicodes](https://publi.codes) et sont éditables dans le fichier [aides.yaml](./src/aides.yaml).

### D’où viennent les données ?

Les aides sont saisies manuellement.

La recherche de ville utilise le paquet [`decoupage-administratif` fournit par Etalab](https://github.com/etalab/decoupage-administratif).

Pour référencer une métropole ou une intercommunalité, utilisez le nom exact défini dans [la liste des EPCI](https://www.collectivites-locales.gouv.fr/institutions/liste-et-composition-des-epci-fiscalite-propre)
