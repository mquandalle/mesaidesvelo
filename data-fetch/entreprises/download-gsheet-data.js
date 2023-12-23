// We replicate the sheel script in NodeJs because the Vercel runtime used to
// build the app doesn't include the wget program
// https://vercel.com/docs/runtimes
import wget from 'wget-improved';
wget.download(
	`https://sheets.googleapis.com/v4/spreadsheets/13h-hrwrnrDLVGSnrzvDyn8zy0UkocOoTZmcu7B1v3S0/values/Aide%20par%20entreprise!A2:E?key=${process.env.GOOGLE_API_KEY}`,
	'data-fetch/entreprises/data/gsheet-forfaits.json',
);
wget.download(
	`https://sheets.googleapis.com/v4/spreadsheets/13h-hrwrnrDLVGSnrzvDyn8zy0UkocOoTZmcu7B1v3S0/values/Liste%20noire!A2:A?key=${process.env.GOOGLE_API_KEY}`,
	'data-fetch/entreprises/data/gsheet-blacklist.json',
);
