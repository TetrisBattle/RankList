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
import { Page } from 'stores/ListStore'

const ItemDialog = () => {
	const { listStore, searchDialogStore } = useStoreContext()
	const options: { page: string; name: string }[] = []

	for (const key in listStore.rankList) {
		const page = key as Page
		const list = listStore.rankList[page]

		let pageDisplayName = 'Page '
		for (const key in listStore.pageOptions) {
			const pageType = key as 'rankPages' | 'extraPages'
			// eslint-disable-next-line no-loop-func
			listStore.pageOptions[pageType].forEach((option) => {
				if (option.value === page)
					pageDisplayName = pageDisplayName + option.displayName
			})
		}

		list?.forEach((item) => {
			options.push({ page: pageDisplayName, name: item.name })
		})
	}

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
						groupBy={(option) => option.page}
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
