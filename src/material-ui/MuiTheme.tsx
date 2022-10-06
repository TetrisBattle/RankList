import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
	interface BreakpointOverrides {
		xs: true // 0
		sm: true // 600
		md: true // 900
		lg: true // 1200
		xl: true // 1536

		// mobile: true; // 0
		// tablet: true; // 640
		// laptop: true; // 1024
		// desktop: true; // 1200
	}
}

const MuiTheme = (isDarkTheme: boolean) => {
	const theme = createTheme({
		breakpoints: {
			values: {
				xs: 0,
				sm: 600,
				md: 900,
				lg: 1200,
				xl: 1536,
			},
		},
		palette: {
			...(isDarkTheme
				? {
						mode: 'dark',
						primary: {
							main: '#850303',
						},
						secondary: {
							main: '#003549',
						},
						background: {
							default: '#000',
						},
				  }
				: {
						mode: 'light',
				  }),
		},
		mixins: {
			toolbar: {}, // This will get rid of minHeight styles
		},
		typography: {
			fontFamily: ['Open Sans', 'Roboto', 'Arial', 'sans-serif'].join(','),
			h1: {
				fontSize: '3rem', // 48px
				fontWeight: 400,
			},
			h2: {
				fontSize: '2.25rem', //36px
				fontWeight: 400,
			},
			h3: {
				fontSize: '1.5rem', // 24px
				fontWeight: 400,
			},
			h4: {
				fontSize: '1.25rem', // 20px
				fontWeight: 400,
			},
			h5: {
				fontSize: '1rem', // 16px
				fontWeight: 400,
			},
			button: {
				fontSize: '1rem',
				fontWeight: 'bold',
				textTransform: 'none',
			},
		},
	})

	return createTheme(theme, {
		components: {
			MuiButton: {
				defaultProps: {
					variant: 'contained',
				},
			},
			MuiMenuItem: {
				styleOverrides: {
					root: {
						'&.Mui-selected': {
							backgroundColor: theme.palette.grey[800] + '!important',
						},
					},
				},
			},
			MuiLink: {
				defaultProps: {
					underline: 'none',
				},
			},
			MuiAppBar: {
				defaultProps: {
					position: 'static',
				},
			},
			MuiToolbar: {
				defaultProps: {
					disableGutters: true,
				},
			},
		},
	})
}

export default MuiTheme
