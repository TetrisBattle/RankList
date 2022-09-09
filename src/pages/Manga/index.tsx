import { observer } from 'mobx-react-lite'
import { Box, CircularProgress } from '@mui/material'
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
			console.log('this', user)
			userStore.currentUser = user
			mangaStore.mangaPath = user
				? `users/${user.uid}/lists/manga`
				: 'users/anonymous/lists/manga'
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
				<MangaList />
				{mangaStore.isLoading && (
					<Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
						<CircularProgress />
					</Box>
				)}
			</Box>
			<MangaDialog />
		</Box>
	)
}

export default observer(Manga)
