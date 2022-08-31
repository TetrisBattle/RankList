import { observer } from 'mobx-react-lite'
import { ThemeProvider } from '@mui/material/styles'
import MuiTheme from './MuiTheme'
import { useStoreContext } from 'stores/StoreContext'
import { ReactChildren } from 'interfaces/react'

const MuiThemeProvider = ({ children }: ReactChildren) => {
	const { appStore: { isDarkTheme } } = useStoreContext()
	const theme = MuiTheme(isDarkTheme)

	return (
		<ThemeProvider theme={theme}>
			{children}
		</ThemeProvider>
	)
}

export default observer(MuiThemeProvider)
