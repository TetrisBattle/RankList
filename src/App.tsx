import { observer } from 'mobx-react-lite'
import { Backdrop, Box, Button, CircularProgress } from '@mui/material'
import { useStoreContext } from 'stores/StoreContext'
import TopBar from 'components/TopBar'
import MangaList from 'components/MangaList'
import MangaDialog from 'components/MangaDialog'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'

const App = () => {
	const { appStore, userStore, mangaStore } = useStoreContext()

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
			userStore.currentUser = user
			mangaStore.mangaPath = user ? `users/${user.uid}/lists/manga` : null
		})
		return unsubscribe
	}, [userStore, mangaStore])

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
				<TopBar />
				{userStore.currentUser === null && (
					<Button
						onClick={() => userStore.login()}
						sx={{
							display: 'block',
							mt: 2,
							mx: 'auto',
							fontWeight: 600,
						}}
					>
						Log in with Google
					</Button>
				)}
				<MangaList />
				{mangaStore.isLoading && (
					<Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
						<CircularProgress />
					</Box>
				)}
			</Box>
			<MangaDialog />
			<Backdrop open={appStore.isLoading} sx={{ zIndex: 9999 }}>
				<CircularProgress />
			</Backdrop>
		</Box>
	)
}

export default observer(App)
