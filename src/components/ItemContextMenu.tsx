import { useState } from 'react'
import {
	Collapse,
	Divider,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { useStoreContext } from 'stores/StoreContext'
import Item from 'models/Item'
import { PageId } from 'interfaces/Ranklist'

const ItemContextMenu = ({
	contextMenu,
	setContextMenu,
	index,
	item,
}: {
	contextMenu: {
		mouseX: number
		mouseY: number
	} | null
	setContextMenu: React.Dispatch<
		React.SetStateAction<{
			mouseX: number
			mouseY: number
		} | null>
	>
	index: number
	item: Item
}) => {
	const { firebaseStore, listStore, itemDialogStore } = useStoreContext()
	const [selectedItemIndex, setSelectedItemIndex] = useState(0)
	const [openSendToMenu, setOpenSendToMenu] = useState(false)

	const onCopy = (item: Item) => {
		navigator.clipboard.writeText(`${item.name} chapter ${item.progress}`)
		setContextMenu(null)
	}

	const onEdit = (item: Item, index: number) => {
		itemDialogStore.dialogType = 'edit'
		itemDialogStore.item = JSON.parse(JSON.stringify(item))
		itemDialogStore.prevItemIndex = index
		itemDialogStore.openDialog()
		setContextMenu(null)
	}

	const onDelete = (index: number) => {
		firebaseStore.delete(index)
		setContextMenu(null)
	}

	const onSendTo = (pageId: PageId) => {
		firebaseStore.sendTo(selectedItemIndex, pageId)
		setContextMenu(null)
	}

	return (
		<Menu
			open={!!contextMenu}
			onClose={() => {
				setContextMenu(null)
				setOpenSendToMenu(false)
			}}
			anchorReference='anchorPosition'
			anchorPosition={
				contextMenu
					? { top: contextMenu.mouseY, left: contextMenu.mouseX }
					: undefined
			}
			transformOrigin={{
				vertical: 'bottom',
				horizontal: 'center',
			}}
		>
			<MenuItem onClick={() => onCopy(item)}>
				<ListItemIcon>
					<ContentCopyIcon fontSize='small' />
				</ListItemIcon>
				<ListItemText>Copy</ListItemText>
			</MenuItem>
			<MenuItem onClick={() => onEdit(item, index)}>
				<ListItemIcon>
					<EditIcon fontSize='small' />
				</ListItemIcon>
				<ListItemText>Edit</ListItemText>
			</MenuItem>
			<MenuItem onClick={() => onDelete(index)}>
				<ListItemIcon>
					<DeleteIcon fontSize='small' />
				</ListItemIcon>
				<ListItemText>Delete</ListItemText>
			</MenuItem>
			<Divider />
			<MenuItem
				onClick={() => {
					setSelectedItemIndex(index)
					setOpenSendToMenu(!openSendToMenu)
				}}
			>
				<ListItemText>Send to</ListItemText>
				{!openSendToMenu ? <ExpandMoreIcon /> : <ExpandLessIcon />}
			</MenuItem>
			<Collapse in={openSendToMenu}>
				<List
					disablePadding
					dense
					sx={{ '.MuiListItemButton-root': { textAlign: 'center' } }}
				>
					{listStore.rankList.map((page) => {
						return (
							<ListItemButton
								key={page.id}
								disabled={page.id === listStore.selectedPage}
								onClick={() => onSendTo(page.id)}
							>
								<ListItemText primary={page.label} />
							</ListItemButton>
						)
					})}
				</List>
			</Collapse>
		</Menu>
	)
}

export default ItemContextMenu