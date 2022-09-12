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

	const onSave = () => {
		appStore.isLoading = true

		if (mangaDialogStore.dialogType === 'new') {
			mangaStore
				.saveNewManga(mangaDialogStore.mangaName, mangaDialogStore.mangaChapter)
				.then(() => {
					appStore.isLoading = false
					mangaDialogStore.openDialog = false
				})
		} else {
			mangaStore
				.edit(
					mangaDialogStore.mangaId,
					mangaDialogStore.mangaName,
					mangaDialogStore.mangaChapter
				)
				.then(() => {
					appStore.isLoading = false
					mangaDialogStore.openDialog = false
				})
		}
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
					value={mangaDialogStore.mangaName}
					onChange={(e) => {
						mangaDialogStore.mangaName = e.target.value
					}}
					label={'Name'}
					color={'info'}
					size={'small'}
					sx={{ mt: 1 }}
				/>
				<TextField
					value={mangaDialogStore.mangaChapter}
					onChange={(e) => {
						mangaDialogStore.mangaChapter = e.target.value
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
