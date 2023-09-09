import { createContext } from 'react'
import RootStore from 'stores/RootStore'

interface StoreContextProviderProps {
	children: React.ReactNode
}

const rootStore = new RootStore()

export const StoreContext = createContext(rootStore)

export function StoreProvider({ children }: StoreContextProviderProps) {
	return (
		<StoreContext.Provider value={rootStore}>
			{children}
		</StoreContext.Provider>
	)
}
