import { Box } from '@mui/material'
import TopBar from './TopBar'
import MangaList from './MangaList'

const Manga = () => {
	return (
		<Box sx={{ maxWidth: 1200, marginInline: 'auto' }}>
			<TopBar />
			<MangaList />
		</Box>
	)
}

export default Manga
