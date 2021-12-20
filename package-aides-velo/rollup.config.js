// L'essentiel de la configuration ci-dessous vise à interfacer le code du
// paquet avec le code de l'application web. Svelte kit propose une commande
// `svelte-kit package` qui permet d'extraire un paquet d'une application. C'est
// une idée super intéressante et ça conviendrait bien à notre cas d'usage.
// Toutefois, je pense qu'en l'état la fonctionnalité manque encore de maturité,
// et j'ai préféré recréer une configuration du paquet (package.json, build,
// plugins, etc.) à partir de rien plutôt que de me baser sur la génération
// offerte par Svelte Kit.
// https://kit.svelte.dev/docs#packaging
import alias from '@rollup/plugin-alias';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import yaml from '@rollup/plugin-yaml';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
	input: 'index.ts',
	output: [
		{
			format: 'cjs',
			exports: 'default',
			file: 'build/index.cjs'
		},
		{
			format: 'es',
			file: 'build/index.es.js'
		}
	],
	external: ['publicodes'],

	plugins: [
		typescript(),
		json(),
		yaml(),
		nodeResolve(),
		alias({
			entries: [{ find: '$lib', replacement: new URL('../src/lib', import.meta.url).pathname }]
		})
	]
};
