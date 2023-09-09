import { useEffect, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
} from '@thng/react'
import { useStore } from 'hooks/useStore'
import firstLetterToUpperCase from 'utils/firstLetterToUpperCase'

export const ItemDialog = observer(() => {
	const { itemDialogStore } = useStore()
	const nameInputRef = useRef<HTMLInputElement | null>(null)
	const progressInputRef = useRef<HTMLInputElement | null>(null)
	const dialogTitle = firstLetterToUpperCase(itemDialogStore.dialogType)

	useEffect(() => {
		if (!itemDialogStore.dialogOpen) return

		if (itemDialogStore.dialogType === 'new') {
			setTimeout(() => nameInputRef.current?.focus(), 100)
		} else if (itemDialogStore.dialogType === 'edit') {
			setTimeout(() => progressInputRef.current?.focus(), 100)
		}

		return () => {
			itemDialogStore.setItem({
				name: '',
				progress: '',
			})
			itemDialogStore.setErrorText('')
		}
	}, [itemDialogStore, itemDialogStore.dialogOpen])

	return (
		<Dialog
			open={itemDialogStore.dialogOpen}
			onClose={() => itemDialogStore.setDialogOpen(false)}
			sx={{ '.MuiPaper-root': { minWidth: 360 } }}
		>
			<DialogTitle sx={{ textAlign: 'center' }}>
				{dialogTitle}
			</DialogTitle>
			<DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
				<TextField
					value={itemDialogStore.item.name}
					onChange={(e) => {
						itemDialogStore.setItem({
							...itemDialogStore.item,
							name: e.target.value,
						})
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
					inputRef={nameInputRef}
					sx={{ mt: 1 }}
				/>
				<TextField
					value={itemDialogStore.item.progress}
					onChange={(e) => {
						itemDialogStore.setItem({
							...itemDialogStore.item,
							progress: e.target.value,
						})
					}}
					onKeyPress={(e) => {
						if (e.key === 'Enter') {
							itemDialogStore.dialogSave()
						}
					}}
					onFocus={(e) => e.target.select()}
					label={'Progress'}
					color={'info'}
					size={'small'}
					autoComplete='off'
					inputRef={progressInputRef}
					sx={{ mt: 2 }}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => itemDialogStore.dialogSave()}>
					Save
				</Button>
				<Button onClick={() => itemDialogStore.setDialogOpen(false)}>
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	)
})
