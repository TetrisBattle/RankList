import { createContext, useContext } from 'react'
import RootStore from 'stores/RootStore'

const StoreContext = createContext<RootStore>({} as RootStore)

export const StoreContextProvider = ({
	children,
}: {
	children: React.ReactNode
}) => {
	const rootStore = new RootStore()

	return (
		<StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
	)
}

export function useStoreContext() {
	return useContext(StoreContext)
}
