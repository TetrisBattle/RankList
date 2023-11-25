import Firebase from 'gateway/Firebase'
import { useEffect, useMemo, useState } from 'react'
import { useStore } from './useStore'

export const useAuth = () => {
	const firebase = useMemo(() => new Firebase(), [])
	const { appStore, listStore } = useStore()
	const [initialized, setInitialized] = useState<boolean>(false)

	useEffect(() => {
		const unsub = firebase.onAuthChange((user) => {
			if (!user?.email) {
				listStore.setUserId('Guest')
				listStore.resetRankList()
				setInitialized(true)
				return
			}
			listStore.setUserId(user.email)
		})
		return () => unsub()
	}, [firebase, appStore, listStore])

	useEffect(() => {
		if (listStore.userId === 'Guest') return
		appStore.setIsLoading(true)

		const unsub = firebase.onDataChange(
			listStore.userId,
			listStore.selectedList,
			(dto) => {
				listStore.setupRankListFromDto(dto)
				appStore.setIsLoading(false)
				setInitialized(true)
			}
		)
		return () => unsub()
	}, [
		firebase,
		appStore,
		listStore,
		listStore.userId,
		listStore.selectedList,
	])

	return initialized
}
