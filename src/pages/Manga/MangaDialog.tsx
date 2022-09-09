import { observer } from 'mobx-react-lite'
import { useStoreContext } from 'stores/StoreContext'
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
} from '@mui/material'

const MangaDialog = () => {
	const { appStore, mangaStore, mangaDialogStore } = useStoreContext()

	const dialogTitle =
		mangaDialogStore.dialogType === 'new' ? 'New Manga' : 'Edit'

	const saveNewManga = () => {
		appStore.isLoading = true
		mangaStore
			.saveNewManga(mangaDialogStore.name, mangaDialogStore.chapter)
			.then(() => {
				appStore.isLoading = false
				mangaDialogStore.openDialog = false
			})
	}

	const saveEditedManga = () => {
		console.log('edit')
	}

	const onSave = () => {
		mangaDialogStore.dialogType === 'new' ? saveNewManga() : saveEditedManga()
	}

	return (
		<Dialog
			open={mangaDialogStore.openDialog}
			onClose={() => {
				mangaDialogStore.openDialog = false
			}}
		>
			<DialogTitle sx={{ textAlign: 'center' }}>{dialogTitle}</DialogTitle>
			<DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
				<TextField
					value={mangaDialogStore.name}
					onChange={(e) => {
						mangaDialogStore.name = e.target.value
					}}
					label={'Name'}
					color={'info'}
					size={'small'}
					sx={{ mt: 1 }}
				/>
				<TextField
					value={mangaDialogStore.chapter}
					onChange={(e) => {
						mangaDialogStore.chapter = e.target.value
					}}
					label={'Chapter'}
					color={'info'}
					size={'small'}
					sx={{ mt: 2 }}
				/>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={() => {
						mangaDialogStore.openDialog = false
					}}
				>
					Cancel
				</Button>
				<Button onClick={onSave}>Save</Button>
			</DialogActions>
		</Dialog>
	)
}

export default observer(MangaDialog)
