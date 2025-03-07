import colors from 'windicss/colors';

export default {
	theme: {
		extend: {
			width: {
				'2xs': '14rem',
			},
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
