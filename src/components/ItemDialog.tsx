import { observer } from 'mobx-react-lite'
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
} from '@mui/material'
import { useStoreContext } from 'stores/StoreContext'

const ItemDialog = () => {
	const { appStore, listStore, dialogStore } = useStoreContext()

	const dialogTitle =
		dialogStore.dialogType === 'new' ? 'New' : 'Edit'

	const onSave = () => {
		appStore.isLoading = true

		if (dialogStore.dialogType === 'new') {
			listStore
				.saveNewItem(dialogStore.name, dialogStore.progress)
				.then(() => {
					appStore.isLoading = false
					dialogStore.openDialog = false
				})
		} else {
			listStore
				.edit(
					dialogStore.name,
					dialogStore.progress
				)
				.then(() => {
					appStore.isLoading = false
					dialogStore.openDialog = false
				})
		}
	}

	return (
		<Dialog
			open={dialogStore.openDialog}
			onClose={() => {
				dialogStore.openDialog = false
			}}
		>
			<DialogTitle sx={{ textAlign: 'center' }}>{dialogTitle}</DialogTitle>
			<DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
				<TextField
					value={dialogStore.name}
					onChange={(e) => {
						dialogStore.name = e.target.value
					}}
					label={'Name'}
					color={'info'}
					size={'small'}
					sx={{ mt: 1 }}
				/>
				<TextField
					value={dialogStore.progress}
					onChange={(e) => {
						dialogStore.progress = e.target.value
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
						dialogStore.openDialog = false
					}}
				>
					Cancel
				</Button>
				<Button onClick={onSave}>Save</Button>
			</DialogActions>
		</Dialog>
	)
}

export default observer(ItemDialog)
