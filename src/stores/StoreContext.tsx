import { createContext, useContext } from 'react'
import { ReactChildren } from 'interfaces/react'
import RootStore from 'stores/RootStore'

const StoreContext = createContext<RootStore>({} as RootStore)

export const StoreContextProvider = ({ children }: ReactChildren) => {
	const rootStore = new RootStore()

	return (
		<StoreContext.Provider value={rootStore}>
			{children}
		</StoreContext.Provider>
	)
}

export function useStoreContext() {
	return useContext(StoreContext)
}
