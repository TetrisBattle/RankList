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
	const dialogTitle =
		itemDialogStore.dialogType.charAt(0).toUpperCase() +
		itemDialogStore.dialogType.slice(1)

	return (
		<Dialog
			open={itemDialogStore.dialogOpen}
			onClose={() => itemDialogStore.closeDialog()}
			sx={{ '.MuiPaper-root': { minWidth: 360 } }}
		>
			<DialogTitle sx={{ textAlign: 'center' }}>{dialogTitle}</DialogTitle>
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
					autoComplete='off'
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
					autoComplete='off'
					sx={{ mt: 2 }}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => itemDialogStore.dialogSave()}>Save</Button>
				<Button onClick={() => itemDialogStore.closeDialog()}>Cancel</Button>
			</DialogActions>
		</Dialog>
	)
}

export default observer(ItemDialog)
