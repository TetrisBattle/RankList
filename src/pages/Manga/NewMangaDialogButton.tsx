import { useStoreContext } from 'stores/StoreContext'
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
} from '@mui/material'
import { useState } from 'react'

const NewMangaDialogButton = () => {
	const [open, setOpen] = useState(false)
	const [name, setName] = useState('')
	const [chapter, setChapter] = useState('')
	const { appStore, mangaStore } = useStoreContext()

	const onSave = (name: string, chapter: string) => {
		appStore.isLoading = true
		mangaStore.saveNewManga(name, chapter)
			.then(() => {
				appStore.isLoading = false
				mangaStore.updateMangas()
				setOpen(false)
				setName('')
				setChapter('')
			})
	}

	return (
		<>
			<Button
				color={'secondary'}
				onClick={() => setOpen(true)}
				sx={{
					borderRadius: 0,
					bgcolor: (theme) => theme.palette.secondary.main,
				}}
			>
				+
			</Button>

			<Dialog open={open} onClose={() => setOpen(false)}>
				<DialogTitle sx={{ textAlign: 'center' }}>New Manga</DialogTitle>
				<DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
					<TextField
						value={name}
						onChange={(e) => setName(e.target.value)}
						label={'Name'}
						color={'info'}
						size={'small'}
						sx={{ mt: 1 }}
					/>
					<TextField
						value={chapter}
						onChange={(e) => setChapter(e.target.value)}
						label={'Chapter'}
						color={'info'}
						size={'small'}
						sx={{ mt: 2 }}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpen(false)}>Cancel</Button>
					<Button onClick={() => onSave(name, chapter)}>
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}

export default NewMangaDialogButton
