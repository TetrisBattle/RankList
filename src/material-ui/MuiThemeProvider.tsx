import { observer } from 'mobx-react-lite'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import MuiTheme from './MuiTheme'
import { useStoreContext } from 'stores/StoreContext'

type MuiThemeProviderProps = {
	children: React.ReactNode
}

const MuiThemeProvider = ({ children }: MuiThemeProviderProps) => {
	const {
		appStore: { isDarkTheme },
	} = useStoreContext()
	const theme = MuiTheme(isDarkTheme)

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	)
}

export default observer(MuiThemeProvider)
