import colors from 'windicss/colors';

export default {
	theme: {
		extend: {
			typography: {
				DEFAULT: {
					css: {
						a: {
							// color: colors.sky[600],
							'&:hover': {
								color: colors.green[600],
							},
						},
					},
				},
			},
		},
	},
	plugins: [
		require('windicss/plugin/typography')({
			modifiers: ['DEFAULT', 'sm'],
		}),
	],
};
