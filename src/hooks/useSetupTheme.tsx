import { useEffect } from 'react'
import { useThemeStore } from '@thng/react'

export const useSetupTheme = () => {
	const themeStore = useThemeStore()

	useEffect(() => {
		themeStore.addThemeOptions(
			{
				palette: {
					mode: 'dark',
					primary: {
						main: '#850303',
					},
					secondary: {
						main: '#003549',
					},
					background: {
						paper: '#040404',
						default: '#000',
					},
				},
			},
			{
				components: {
					MuiTextField: {
						defaultProps: {
							color: 'info',
							size: 'small',
						},
					},
					MuiSelect: {
						defaultProps: {
							color: 'info',
							size: 'small',
						},
					},
				},
			}
		)
	}, [themeStore])
}
