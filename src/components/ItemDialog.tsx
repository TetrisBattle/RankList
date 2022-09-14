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
	const { listStore } = useStoreContext()
	const dialogTitle = listStore.dialogType === 'new' ? 'New' : 'Edit'

	return (
		<Dialog
			open={listStore.dialogOpen}
			onClose={() => listStore.dialogClose()}
		>
			<DialogTitle sx={{ textAlign: 'center' }}>{dialogTitle}</DialogTitle>
			<DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
				<TextField
					value={listStore.dialogItem.name}
					onChange={(e) => {
						listStore.dialogItemName = e.target.value
					}}
					label={'Name'}
					color={'info'}
					size={'small'}
					error={!!listStore.dialogErrorText}
					helperText={listStore.dialogErrorText}
					sx={{ mt: 1 }}
				/>
				<TextField
					value={listStore.dialogItem.progress}
					onChange={(e) => {
						listStore.dialogItemProgress = e.target.value
					}}
					label={'Chapter'}
					color={'info'}
					size={'small'}
					sx={{ mt: 2 }}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => listStore.dialogClose()}>Cancel</Button>
				<Button onClick={() => listStore.dialogSave()}>Save</Button>
			</DialogActions>
		</Dialog>
	)
}

export default observer(ItemDialog)
