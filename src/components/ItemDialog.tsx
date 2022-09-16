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
	const { dialogStore } = useStoreContext()
	const dialogTitle = dialogStore.dialogType === 'new' ? 'New' : 'Edit'

	return (
		<Dialog
			open={dialogStore.dialogOpen}
			onClose={() => dialogStore.closeDialog()}
		>
			<DialogTitle sx={{ textAlign: 'center' }}>{dialogTitle}</DialogTitle>
			<DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
				<TextField
					value={dialogStore.dialogItem.name}
					onChange={(e) => {
						dialogStore.dialogItemName = e.target.value
					}}
					label={'Name'}
					color={'info'}
					size={'small'}
					error={!!dialogStore.dialogErrorText}
					helperText={dialogStore.dialogErrorText}
					sx={{ mt: 1 }}
				/>
				<TextField
					value={dialogStore.dialogItem.progress}
					onChange={(e) => {
						dialogStore.dialogItemProgress = e.target.value
					}}
					label={'Chapter'}
					color={'info'}
					size={'small'}
					sx={{ mt: 2 }}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => dialogStore.closeDialog()}>Cancel</Button>
				<Button onClick={() => dialogStore.dialogSave()}>Save</Button>
			</DialogActions>
		</Dialog>
	)
}

export default observer(ItemDialog)
