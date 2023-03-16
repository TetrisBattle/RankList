import { createContext, useContext } from 'react'
import RootStore from 'stores/RootStore'

interface StoreContextProviderProps {
	children: React.ReactNode
}

const rootStore = new RootStore()
const StoreContext = createContext(rootStore)

export function StoreContextProvider({ children }: StoreContextProviderProps) {
	return (
		<StoreContext.Provider value={rootStore}>
			{children}
		</StoreContext.Provider>
	)
}

export function useStoreContext() {
	return useContext(StoreContext)
}
