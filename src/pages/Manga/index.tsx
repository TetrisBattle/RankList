import { observer } from 'mobx-react-lite'
import { Box, Button, CircularProgress } from '@mui/material'
import { useStoreContext } from 'stores/StoreContext'
import TopBar from './TopBar'
import MangaList from './MangaList'
import MangaDialog from './MangaDialog'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'

const Manga = () => {
	const { userStore, mangaStore } = useStoreContext()

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
			userStore.currentUser = user
			mangaStore.mangaPath = user ? `users/${user.uid}/lists/manga` : null
		})
		return unsubscribe
	}, [userStore, mangaStore])

	return (
		<Box>
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
		</Box>
	)
}

export default observer(Manga)
