import { ThemeOptions, createTheme } from '@thng/react'

const t = createTheme()

export const theme: ThemeOptions = {
	palette: {
		primary: {
			main: '#850303',
		},
		secondary: {
			main: '#003549',
		},
		background: {
			default: 'black',
		},
	},
	components: {
		MuiMenuItem: {
			styleOverrides: {
				root: {
					'&.Mui-selected': {
						backgroundColor: t.palette.grey[800] + '!important',
					},
				},
			},
		},
	},
}
