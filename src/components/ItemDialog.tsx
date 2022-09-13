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
	const { appStore, listStore } = useStoreContext()
	const dialogTitle = listStore.dialogType === 'new' ? 'New' : 'Edit'

	const onSave = () => {
		appStore.isLoading = true

		if (listStore.dialogType === 'new') {
			listStore.addNewItem().then(() => {
				appStore.isLoading = false
				listStore.openDialog = false
			})
		} else {
			listStore.edit().then(() => {
				appStore.isLoading = false
				listStore.openDialog = false
			})
		}
	}

	return (
		<Dialog
			open={listStore.openDialog}
			onClose={() => {
				listStore.openDialog = false
			}}
		>
			<DialogTitle sx={{ textAlign: 'center' }}>{dialogTitle}</DialogTitle>
			<DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
				<TextField
					value={listStore.editableItem.name}
					onChange={(e) => {
						listStore.editableItemName = e.target.value
					}}
					label={'Name'}
					color={'info'}
					size={'small'}
					sx={{ mt: 1 }}
				/>
				<TextField
					value={listStore.editableItem.progress}
					onChange={(e) => {
						listStore.editableItemProgress = e.target.value
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
						listStore.openDialog = false
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
