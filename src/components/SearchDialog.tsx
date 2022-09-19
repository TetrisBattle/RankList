import { observer } from 'mobx-react-lite'
import {
	Autocomplete,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
} from '@mui/material'
import { useStoreContext } from 'stores/StoreContext'

const ItemDialog = () => {
	const { listStore, searchDialogStore } = useStoreContext()
	const options: { pageLabel: string; name: string }[] = []

	listStore.rankList.forEach((page) => {
		page.list.forEach((item) => {
			options.push({ pageLabel: page.label, name: item.name })
		})
	})

	return (
		<>
			<Dialog
				open={searchDialogStore.dialogOpen}
				onClose={() => searchDialogStore.closeDialog()}
			>
				<DialogTitle sx={{ textAlign: 'center' }}>Search</DialogTitle>
				<DialogContent>
					<Autocomplete
						autoComplete
						options={options}
						groupBy={(option) => option.pageLabel}
						getOptionLabel={(option) => option.name}
						renderInput={(params) => <TextField {...params} color={'info'} />}
						noOptionsText={'Not found'}
						sx={{ minWidth: 360 }}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => searchDialogStore.closeDialog()}>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}

export default observer(ItemDialog)
