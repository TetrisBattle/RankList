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

	return (
		<Dialog
			open={itemDialogStore.dialogOpen}
			onClose={() => itemDialogStore.closeDialog()}
		>
			<DialogTitle sx={{ textAlign: 'center' }}>
				{itemDialogStore.dialogType}
			</DialogTitle>
			<DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
				<TextField
					value={itemDialogStore.item.name}
					onChange={(e) => {
						itemDialogStore.name = e.target.value
					}}
					label={'Name'}
					color={'info'}
					size={'small'}
					error={!!itemDialogStore.errorText}
					helperText={itemDialogStore.errorText}
					sx={{ mt: 1 }}
				/>
				<TextField
					value={itemDialogStore.item.progress}
					onChange={(e) => {
						itemDialogStore.progress = e.target.value
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
