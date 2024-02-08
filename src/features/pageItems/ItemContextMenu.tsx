import { ListItemIcon, ListItemText, Menu, MenuItem } from '@thng/react'
import SearchIcon from '@mui/icons-material/Search'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useStore } from 'hooks/useStore'
import { ConfirmDialog } from './ConfirmDialog'
import { useState } from 'react'

export type ContextMenu = {
	left: number
	top: number
}

type ItemContextMenuProps = {
	contextPos: ContextMenu
	setContextPos: React.Dispatch<React.SetStateAction<ContextMenu>>
}

export const ItemContextMenu = ({
	contextPos,
	setContextPos,
}: ItemContextMenuProps) => {
	const { appStore } = useStore()
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false)

	function onClose() {
		setContextPos({ left: 0, top: 0 })
	}

	function onGoogleSearch() {
		const googleSearch = `https://google.com/search?q=${
			appStore.selectedItem.name
		} chapter ${appStore.selectedItem.progress ?? 1}`
		window.open(googleSearch, '_blank')
		onClose()
	}

	function onCopy() {
		navigator.clipboard.writeText(appStore.selectedItem.name)
		onClose()
	}

	function onEdit() {
		appStore.setDialogOpen(true)
		onClose()
	}

	function onDelete() {
		setOpenConfirmDialog(true)
		onClose()
	}

	return (
		<>
			<Menu
				open={Boolean(contextPos.left && contextPos.top)}
				onClose={onClose}
				anchorReference='anchorPosition'
				anchorPosition={contextPos}
				disableAutoFocusItem
				slotProps={{ paper: { sx: { boxShadow: 2 } } }}
			>
				{appStore.selectedList === 'mangas' && (
					<MenuItem onClick={onGoogleSearch}>
						<ListItemIcon>
							<SearchIcon fontSize='small' />
						</ListItemIcon>
						<ListItemText>Google Search</ListItemText>
					</MenuItem>
				)}
				<MenuItem onClick={onCopy}>
					<ListItemIcon>
						<ContentCopyIcon fontSize='small' />
					</ListItemIcon>
					<ListItemText>Copy</ListItemText>
				</MenuItem>
				<MenuItem onClick={onEdit}>
					<ListItemIcon>
						<EditIcon fontSize='small' />
					</ListItemIcon>
					<ListItemText>Edit</ListItemText>
				</MenuItem>
				<MenuItem onClick={onDelete}>
					<ListItemIcon>
						<DeleteIcon fontSize='small' />
					</ListItemIcon>
					<ListItemText>Delete</ListItemText>
				</MenuItem>
			</Menu>
			<ConfirmDialog
				open={openConfirmDialog}
				onConfirm={() => {
					appStore.delete(appStore.selectedItem.id)
					setOpenConfirmDialog(false)
				}}
				onCancel={() => setOpenConfirmDialog(false)}
				title='Delete'
				content={`Are you sure you want to delete ${appStore.selectedItem.name}?`}
			/>
		</>
	)
}
