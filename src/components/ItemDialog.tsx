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
	const { itemDialogStore } = useStoreContext()
	const dialogTitle = itemDialogStore.dialogType === 'new' ? 'New' : 'Edit'

	return (
		<Dialog
			open={itemDialogStore.dialogOpen}
			onClose={() => itemDialogStore.closeDialog()}
		>
			<DialogTitle sx={{ textAlign: 'center' }}>{dialogTitle}</DialogTitle>
			<DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
				<TextField
					value={itemDialogStore.dialogItem.name}
					onChange={(e) => {
						itemDialogStore.dialogItemName = e.target.value
					}}
					label={'Name'}
					color={'info'}
					size={'small'}
					error={!!itemDialogStore.dialogErrorText}
					helperText={itemDialogStore.dialogErrorText}
					sx={{ mt: 1 }}
				/>
				<TextField
					value={itemDialogStore.dialogItem.progress}
					onChange={(e) => {
						itemDialogStore.dialogItemProgress = e.target.value
					}}
					label={'Chapter'}
					color={'info'}
					size={'small'}
					sx={{ mt: 2 }}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => itemDialogStore.closeDialog()}>Cancel</Button>
				<Button onClick={() => itemDialogStore.dialogSave()}>Save</Button>
			</DialogActions>
		</Dialog>
	)
}

export default observer(ItemDialog)
