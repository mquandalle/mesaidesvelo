#!/bin/bash
wget https://sheets.googleapis.com/v4/spreadsheets/13h-hrwrnrDLVGSnrzvDyn8zy0UkocOoTZmcu7B1v3S0/values/Aide%20par%20entreprise!A2:E?key=${GOOGLE_API_KEY} -O data/gsheet-forfaits.json
wget https://sheets.googleapis.com/v4/spreadsheets/13h-hrwrnrDLVGSnrzvDyn8zy0UkocOoTZmcu7B1v3S0/values/Liste%20noire!A2:A?key=${GOOGLE_API_KEY} -O data/gsheet-blacklist.json