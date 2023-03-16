import { createTheme } from '@mui/material/styles'
import defaultTheme from './defaultTheme'

export default function MuiTheme(isDarkTheme: boolean) {
	const theme = defaultTheme(isDarkTheme)

	return createTheme(theme, {
		components: {
			MuiMenuItem: {
				styleOverrides: {
					root: {
						'&.Mui-selected': {
							backgroundColor:
								theme.palette.grey[800] + '!important',
						},
					},
				},
			},
		},
	})
}
