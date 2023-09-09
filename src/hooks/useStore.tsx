import { useContext } from 'react'
import { StoreContext } from 'stores/StoreProvider'

export const useStore = () => {
	return useContext(StoreContext)
}
