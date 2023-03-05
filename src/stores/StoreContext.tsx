import { createContext, useContext } from 'react'
import RootStore from 'stores/RootStore'

type StoreContextProviderProps = {
	children: React.ReactNode
}

const StoreContext = createContext({} as RootStore)

export function StoreContextProvider({ children }: StoreContextProviderProps) {
	const rootStore = new RootStore()
	return (
		<StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
	)
}

export function useStoreContext() {
	return useContext(StoreContext)
}
