# mesaidesvelo.fr

### Puis-je bénéficier d'aides pour acheter un vélo ?

De nombreuses villes proposent des aides à l'achat de vélos. Leur objectif est
d'encourager l'usage du vélo sur leur territoire. Il existe aussi des aides au
niveau du département, de la région ainsi qu'au niveau national.

Les modalités de ces aides sont variées, elles sont parfois cumulables et
parfois pas, parfois conditionnées à un niveau de revenus et d'autres fois
ouvertes à tous, etc.

**mesaidesvelo.fr** rassemble [toutes les
aides](https://mesaidesvelo.fr/liste-aides)[^1] existantes et permet d'en estimer
le montant rapidement et simplement.

[^1]:
    _ou presque_. En effet, nous allons jusqu'au niveau de la commune pour
    référencer les aides. Ce qui représente un grand nombre d'aides à maintenir et
    référencer. Or ce travail est fait à la main par quelques personnes des équipes
    beta.gouv.fr. Si vous souhaitez faire remonter une aide manquante ou plus à
    jour, veuillez consulter la section [Comment contribuer
    ?](#comment-contribuer-).

### Comment contribuer ?

#### Pour corriger ou proposer une aide

> [!NOTE]
> Les aides sont modélisées dans un dépôt dédié :
> [betagouv/publicodes-aides-velo](https://github.com/betagouv/publicodes-aides-velo).

Vous avez identifié une erreur ou une aide que nous ne prenons pas en compte ?

Vous pouvez [ouvrir un ticket sur
GitHub](https://github.com/betagouv/publicodes-aides-velo/issues/new).

#### Pour améliorer l'application

Si vous êtes développeur/euse vous pouvez aussi améliorer l'application. Il
s'agit d'une application JavaScript, utilisant [Svelte
Kit](https://kit.svelte.dev) et [Windi.css](https://windicss.org) pour
l'interface.

Pour lancer l'application en mode développement utilisez les commandes
suivantes :

```sh
npm install
npm run dev
```

Les tests d'intégrations utilisent [Playwright](https://playwright.dev/). En
cas d'erreur vous pouvez voir le navigateur en action avec l'option `--headed`

```sh
npx playwright install
npm run test:playwright -- --headed
```

### D'où viennent les données ?

Les aides sont modélisées en [Publicodes](https://publi.codes) dans le dépôt
[`betagouv/publicodes-aides-velo`](https://github.com/betagouv/publicodes-aides-velo).

> [!NOTE]
> Historiquement, les aides étaient référencées et modélisées dans ce dépôt.
> Cependant, comme elles ont commencé à être réutilisées dans d'autres projets
> (tel que [1jeune1solution](https://mes-aides.1jeune1solution.beta.gouv.fr) ou
> [J'agis](https://jagis.beta.gouv.fr)), elles ont été déplacées dans un dépôt
> dédié afin de faciliter leur maintenance par les différentes équipes.

La recherche de ville utilise le paquet [`decoupage-administratif` fourni par
Etalab](https://github.com/etalab/decoupage-administratif).

Pour référencer une métropole ou une intercommunalité, utilisez le nom exact
défini dans [la liste des
EPCI](https://www.collectivites-locales.gouv.fr/institutions/liste-et-composition-des-epci-fiscalite-propre)

La liste des entreprises pour la page sur le forfait mobilité est [extraite de
la base Insee](./src/scripts/download-sirene-data.sh).
