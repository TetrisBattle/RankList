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
import SearchIcon from '@mui/icons-material/Search'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { useStoreContext } from 'stores/StoreContext'
import { Item, PageId } from 'types'

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

	const onGoogleSearch = (item: Item) => {
		let googleSearch = 'https://google.com/search?q='
		googleSearch += item.progress
			? `${item.name} chapter ${item.progress}`
			: `read ${item.name}`
		window.open(googleSearch, '_blank')
		setContextMenu(null)
	}

	const onCopy = (item: Item) => {
		navigator.clipboard.writeText(item.name)
		setContextMenu(null)
	}

	const onEdit = (item: Item, index: number) => {
		itemDialogStore.dialogType = 'edit'
		itemDialogStore.item = JSON.parse(JSON.stringify(item))
		itemDialogStore.prevItemIndex = index
		itemDialogStore.targetPageId = listStore.selectedPage
		itemDialogStore.openDialog()
		setContextMenu(null)
	}

	const onDelete = (index: number) => {
		firebaseStore.delete(index)
		setContextMenu(null)
	}

	const onSendTo = (targetPageId: PageId) => {
		firebaseStore.sendTo(targetPageId, selectedItemIndex)
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
			{listStore.selectedList === 'MangaList' && (
				<MenuItem onClick={() => onGoogleSearch(item)}>
					<ListItemIcon>
						<SearchIcon fontSize='small' />
					</ListItemIcon>
					<ListItemText>Google Search</ListItemText>
				</MenuItem>
			)}
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
