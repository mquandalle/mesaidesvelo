/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts,svx}', './node_modules/layerchart/**/*.{svelte,js}'],
	theme: {
		extend: {
			colors: {
				light: {
					100: '#fcfcfc',
				},
			},
			spacing: {
				8.5: '2.125rem',
				18: '4.5rem',
				30: '7.5rem',
				35: '8.75rem',
			},
			width: {
				'2xs': '14rem',
			},
			zIndex: {
				99: '99',
			},
			typography: ({ theme }) => ({
				DEFAULT: {
					css: {
						a: {
							'&:hover': {
								color: theme('colors.green.600'),
							},
						},
					},
				},
			}),
		},
	},
};
