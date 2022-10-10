import { useEffect, useRef } from 'react'
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
	const inputRef = useRef<HTMLInputElement | null>(null)
	const dialogTitle =
		itemDialogStore.dialogType.charAt(0).toUpperCase() +
		itemDialogStore.dialogType.slice(1)

	useEffect(() => {
		if (itemDialogStore.dialogOpen) {
			setTimeout(() => inputRef.current?.focus(), 100)
		}
	}, [itemDialogStore.dialogOpen])

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
					onKeyPress={(e) => {
						if (e.key === 'Enter') {
							itemDialogStore.dialogSave()
						}
					}}
					label={'Name'}
					color={'info'}
					size={'small'}
					error={!!itemDialogStore.errorText}
					helperText={itemDialogStore.errorText}
					autoComplete='off'
					inputRef={inputRef}
					sx={{ mt: 1 }}
				/>
				<TextField
					value={itemDialogStore.item.progress}
					onChange={(e) => {
						itemDialogStore.progress = e.target.value
					}}
					onKeyPress={(e) => {
						if (e.key === 'Enter') {
							itemDialogStore.dialogSave()
						}
					}}
					label={'Progress'}
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
