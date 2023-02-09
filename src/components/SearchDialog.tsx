import React, { useState } from 'react'
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

const SearchDialog = ({
	open,
	setOpen,
}: {
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
	const { listStore, itemDialogStore } = useStoreContext()
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
		setOpen(false)
	}

	return (
		<>
			<Dialog
				open={open}
				onClose={onClose}
				sx={{ '.MuiPaper-root': { minWidth: 360 } }}
			>
				<DialogTitle sx={{ textAlign: 'center' }}>Search</DialogTitle>
				<DialogContent>
					<Autocomplete
						options={options}
						value={searchResult}
						onChange={(e, value) => setSearchResult(value)}
						renderInput={(params) => (
							<TextField
								{...params}
								label={
									searchResult ? `Page: ${searchResult.pageLabel}` : 'Search'
								}
								color={'info'}
							/>
						)}
						groupBy={(option) => option.pageId}
						getOptionLabel={(option) => option.item.name}
						noOptionsText={'Not found'}
						isOptionEqualToValue={(option, value) =>
							option.item.name === value.item.name
						}
						autoComplete
						size='small'
						sx={{ mt: 1 }}
					/>
					{searchResult && (
						<TextField
							label='Progress'
							value={searchResult.item.progress}
							disabled
							fullWidth
							size='small'
							sx={{ mt: 2 }}
						/>
					)}
				</DialogContent>
				<DialogActions>
					<Button
						disabled={!searchResult}
						onClick={() => {
							if (!searchResult) return
							itemDialogStore.targetPageId = searchResult.pageId
							itemDialogStore.prevItemIndex = searchResult.itemIndex
							itemDialogStore.item = JSON.parse(
								JSON.stringify(searchResult.item)
							)
							onClose()
							itemDialogStore.dialogType = 'edit'
							itemDialogStore.openDialog()
						}}
					>
						Edit
					</Button>
					<Button onClick={() => setOpen(false)}>Cancel</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}

export default observer(SearchDialog)
