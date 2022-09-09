import { observer } from 'mobx-react-lite'
import { Box, CircularProgress } from '@mui/material'
import { useStoreContext } from 'stores/StoreContext'
import TopBar from './TopBar'
import MangaList from './MangaList'
import MangaDialog from './MangaDialog'

const Manga = () => {
	const { mangaStore } = useStoreContext()

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
