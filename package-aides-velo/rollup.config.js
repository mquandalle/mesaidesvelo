import typescript from '@rollup/plugin-typescript';
import yaml from '@rollup/plugin-yaml';

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
	plugins: [typescript(), yaml()]
};
