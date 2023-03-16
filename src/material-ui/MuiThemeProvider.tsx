import { observer } from 'mobx-react-lite'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import muiTheme from './MuiTheme'
import { useStoreContext } from 'stores/StoreContext'

interface MuiThemeProviderProps {
	children: React.ReactNode
}

function MuiThemeProvider({ children }: MuiThemeProviderProps) {
	const { appStore } = useStoreContext()
	const theme = muiTheme(appStore.isDarkTheme)

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	)
}

export default observer(MuiThemeProvider)
