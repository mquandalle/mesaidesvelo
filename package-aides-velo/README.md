# Paquet `aides-velo`

Ce paquet est un emballage léger autour du moteur [publicodes](https://publi.codes/) et de la base d'aides vélo écrite dans ce langage. L'objectif est d'avoir une interface simple pour faciliter l'intégration de ces données sur des sites tiers, en particulier sur https://www.1jeune1solution.gouv.fr/mes-aides.

Idéalement on ne devrait pas avoir besoin de ce paquet, en effet on pourrait utiliser directement l'API publicodes pour récupérer toutes les informations utiles depuis la base de règles. Cela nécessite sans doute encore quelques améliorations côté publicodes pour que être réellement facile à utiliser. Et donc en attendant ce paquet joue le rôle de “colle” pour faciliter l'interfaçage, et garantir la retro-compatibilité en cas d'évolutions du moteur sous-jacent.

Les aides sont explorables sur https://mesaidesvelo.fr
