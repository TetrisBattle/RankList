import { observer } from 'mobx-react-lite'
import { Backdrop, Box, Button, CircularProgress } from '@mui/material'
import { useStoreContext } from 'stores/StoreContext'
import TopBar from 'components/TopBar'
import ItemList from 'components/ItemList'
import ItemDialog from 'components/ItemDialog'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'
import { onSnapshot } from 'firebase/firestore'

const App = () => {
	const { appStore, firebaseStore, listStore } = useStoreContext()

	useEffect(() => {
		const unsubUser = onAuthStateChanged(getAuth(), (user) => {
			firebaseStore.user = user?.email
			firebaseStore.setupListRef()
		})
		return () => unsubUser()
	}, [firebaseStore, listStore])

	useEffect(() => {
		if (!firebaseStore.listRef) return

		appStore.isLoading = true
		const unsubList = onSnapshot(firebaseStore.listRef, (doc) => {
			if (!doc.data() === undefined) return
			listStore.rankList = doc.data() ?? []
			appStore.isLoading = false
		})

		return () => unsubList()
	}, [appStore, listStore, firebaseStore.listRef, listStore.selectedListIndex])

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
			<TopBar />
			<ItemList />
			{listStore.isLoading && (
				<Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
					<CircularProgress />
				</Box>
			)}
		</>
	)

	return (
		<Box
			sx={(theme) => ({
				bgcolor: theme.palette.background.default,
				minHeight: '100vh',
				color: theme.palette.text.primary,
			})}
		>
			<Box
				sx={{
					maxWidth: (theme) => theme.breakpoints.values.md,
					marginInline: 'auto',
				}}
			>
				{!firebaseStore.user ? <LoginButton /> : <RankList />}
			</Box>
			<ItemDialog />
			<Backdrop open={appStore.isLoading} sx={{ zIndex: 99 }}>
				<CircularProgress />
			</Backdrop>
		</Box>
	)
}

export default observer(App)
