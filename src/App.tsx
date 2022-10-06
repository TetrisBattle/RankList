import { useEffect, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { onSnapshot } from 'firebase/firestore'
import { Backdrop, Box, Button, CircularProgress } from '@mui/material'
import { useStoreContext } from 'stores/StoreContext'
import TopBar from 'components/TopBar'
import PageList from 'components/PageList'
import ItemDialog from 'components/ItemDialog'
import SearchDialog from 'components/SearchDialog'

const App = () => {
	const { appStore, firebaseStore, listStore } = useStoreContext()
	const topBarRef = useRef<HTMLElement>()
	const topBarHeight = topBarRef.current?.clientHeight ?? 0

	useEffect(() => {
		const unsubUser = onAuthStateChanged(getAuth(), (user) => {
			if (!user || !user.email) {
				firebaseStore.user = 'Guest'
				listStore.resetRankList()
				return
			}

			if (appStore.devMode) firebaseStore.user = 'dev'
			else firebaseStore.user = user.email

			firebaseStore.setupListRef()
		})
		return () => unsubUser()
	}, [appStore, firebaseStore, listStore])

	useEffect(() => {
		if (firebaseStore.user === 'Guest') return

		appStore.isLoading = true
		const unsubList = onSnapshot(firebaseStore.listRef, (doc) => {
			const dto = doc.data()
			listStore.setupRankListFromDto(dto)
			appStore.isLoading = false
		})

		return () => unsubList()
	}, [appStore, listStore, firebaseStore, firebaseStore.listRef])

	const LoginButton = () => (
		<Button
			onClick={() => firebaseStore.login()}
			sx={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				fontWeight: 600,
			}}
		>
			Log in with Google
		</Button>
	)

	const RankList = () => (
		<>
			<TopBar topBarRef={topBarRef} />
			<Box sx={{ mt: topBarHeight / 8 }} />
			<PageList />
			{listStore.isLoading && (
				<Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
					<CircularProgress />
				</Box>
			)}
		</>
	)

	return (
		<>
			<Box
				sx={{
					maxWidth: (theme) => theme.breakpoints.values.md,
					marginInline: 'auto',
				}}
			>
				{firebaseStore.user === 'Guest' ? <LoginButton /> : <RankList />}
			</Box>
			<ItemDialog />
			<SearchDialog />
			<Backdrop open={appStore.isLoading} sx={{ zIndex: 99 }}>
				<CircularProgress />
			</Backdrop>
		</>
	)
}

export default observer(App)
