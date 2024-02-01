import { StoreProvider } from 'stores/StoreProvider'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BaseThemeProvider } from '@thng/react'
import { App } from 'App'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<StoreProvider>
			<BaseThemeProvider>
				<App />
			</BaseThemeProvider>
		</StoreProvider>
	</React.StrictMode>
)
