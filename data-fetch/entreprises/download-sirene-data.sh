#!/bin/bash
# Script pour récupérer la liste des entreprises ainsi que leur effectif
#
# Les données sont disponibles sur data.gouv.fr
# https://www.data.gouv.fr/fr/datasets/base-sirene-des-entreprises-et-de-leurs-etablissements-siren-siret/
#
# Le fichier utilisé est « Sirene : Fichier StockUniteLegale »
# Documentation: https://www.data.gouv.fr/fr/datasets/r/48e55481-82cf-4d90-9db0-49612e15c36c

cd data
if [[ $1 = "download" ]]; then
    echo "Téléchargement des données"
    wget https://www.data.gouv.fr/fr/datasets/r/825f4199-cadd-486c-ac46-a65a8ea1a047 -O StockUniteLegale.zip
    unzip StockUniteLegale.zip
fi

# Nécessite d'installer xsv pour la maniupulation performante du csv

xsv input StockUniteLegale_utf8.csv \
    # On sélectionne les sociétés commerciales et personnes morales immatriculés au RCS
    # Documentation: https://www.insee.fr/fr/information/2028129
    | xsv search -s categorieJuridiqueUniteLegale "^[56]" \
    # Sociétés de plus de 50 salariés
    | xsv search -s trancheEffectifsUniteLegale '[2-9][0-9]+' \
    | xsv select denominationUniteLegale,trancheEffectifsUniteLegale \
    > entreprises.csv
