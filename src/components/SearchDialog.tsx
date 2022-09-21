import { useState } from 'react'
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
import { Item, PageId } from 'types'

interface SearchOption {
	pageId: PageId
	pageLabel: String
	itemIndex: number
	item: Item
}

const ItemDialog = () => {
	const { listStore, itemDialogStore, searchDialogStore } = useStoreContext()
	const options: SearchOption[] = []
	const [searchResult, setSearchResult] = useState<SearchOption | null>(null)

	listStore.rankList.forEach((page) => {
		page.list.forEach((item, index) => {
			options.push({
				pageId: page.id,
				pageLabel: page.label,
				itemIndex: index,
				item: item,
			})
		})
	})

	const onClose = () => {
		setSearchResult(null)
		searchDialogStore.closeDialog()
	}

	return (
		<>
			<Dialog
				open={searchDialogStore.dialogOpen}
				onClose={onClose}
				sx={{ '.MuiPaper-root': { minWidth: 360 } }}
			>
				<DialogTitle sx={{ textAlign: 'center' }}>Search</DialogTitle>
				<DialogContent>
					<Autocomplete
						options={options}
						value={searchResult}
						onChange={(e, value) => setSearchResult(value)}
						renderInput={(params) => <TextField {...params} color={'info'} />}
						groupBy={(option) => option.pageId}
						getOptionLabel={(option) => option.item.name}
						noOptionsText={'Not found'}
						isOptionEqualToValue={(option, value) =>
							option.item.name === value.item.name
						}
						autoComplete
					/>
				</DialogContent>
				<DialogActions>
					<Button
						disabled={!searchResult}
						onClick={() => {
							if (!searchResult) return
							itemDialogStore.targetPageId = searchResult.pageId
							itemDialogStore.prevItemIndex = searchResult.itemIndex
							itemDialogStore.item = JSON.parse(JSON.stringify(searchResult.item))
							onClose()
							itemDialogStore.dialogType = 'edit'
							itemDialogStore.openDialog()
						}}
					>
						Edit
					</Button>
					<Button onClick={() => searchDialogStore.closeDialog()}>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}

export default observer(ItemDialog)
