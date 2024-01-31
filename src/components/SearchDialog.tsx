import React, { useState } from 'react'
import {
	Autocomplete,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	observer,
} from '@thng/react'
import { useStore } from 'hooks/useStore'
import { Item, PageId } from 'types'

type SearchDialogProps = {
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

type SearchOption = {
	pageId: PageId
	pageLabel: string
	itemIndex: number
	item: Item
}

export const SearchDialog = observer(({ open, setOpen }: SearchDialogProps) => {
	const { listStore, itemDialogStore } = useStore()
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

	function onClose() {
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
						onChange={(_e, value) => setSearchResult(value)}
						renderInput={(params) => (
							<TextField
								{...params}
								label={
									searchResult
										? `Page: ${searchResult.pageLabel}`
										: 'Search'
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
							itemDialogStore.setTargetPageId(searchResult.pageId)
							itemDialogStore.setSelectedItemIndex(
								searchResult.itemIndex
							)
							itemDialogStore.setItem(
								JSON.parse(JSON.stringify(searchResult.item))
							)
							onClose()
							itemDialogStore.setDialogType('edit')
							itemDialogStore.setDialogOpen(true)
						}}
					>
						Edit
					</Button>
					<Button onClick={() => setOpen(false)}>Cancel</Button>
				</DialogActions>
			</Dialog>
		</>
	)
})
