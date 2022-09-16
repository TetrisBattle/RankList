import { useState, useRef, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import {
	Box,
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
import { Page } from 'stores/ListStore'

const ListItem = ({ index, item }: { index: number; item: Item }) => {
	const { listStore, firebaseStore, dialogStore } = useStoreContext()
	const itemRef: React.MutableRefObject<HTMLElement | null> = useRef(null)
	const [contextMenu, setContextMenu] = useState<{
		mouseX: number
		mouseY: number
	} | null>(null)
	const [editableItemIndex, setEditableItemIndex] = useState<number | null>(
		null
	)

	useEffect(() => {
		listStore.editableItemIndex = editableItemIndex
	}, [listStore, editableItemIndex])

	const onCopy = (item: Item) => {
		navigator.clipboard.writeText(`${item.name} chapter ${item.progress}`)
		setContextMenu(null)
	}

	const onEdit = (item: Item, index: number) => {
		dialogStore.dialogType = 'edit'
		dialogStore.dialogItem = {
			index,
			...item,
		}
		listStore.editableItemIndex = index
		dialogStore.openDialog()
		setContextMenu(null)
	}

	const onDelete = (index: number) => {
		firebaseStore.delete(index)
		setContextMenu(null)
	}

	const onSendTo = (page: Page) => {
		if (editableItemIndex === null) return
		firebaseStore.sendTo(editableItemIndex, page)
		setContextMenu(null)
	}

	const handleContextMenu = (event: React.MouseEvent) => {
		event.preventDefault()
		setContextMenu(
			contextMenu
				? null
				: {
						mouseX: event.clientX,
						mouseY: event.clientY,
				  }
		)
	}

	return (
		<Box
			onContextMenu={handleContextMenu}
			sx={{
				display: 'flex',
				gap: 0.5,
				width: 1,
				justifyContent: 'center',
				'.MuiListItemText-root': {
					bgcolor: (theme) => theme.palette.secondary.main,
					mt: 0,
				},
			}}
		>
			<ListItemText primary={index + 1} sx={{ flex: 1, textAlign: 'center' }} />
			<ListItemText
				primary={item.name}
				ref={itemRef}
				sx={{ flex: listStore.selectedList !== 'movies' ? 10 : 8, pl: 1 }}
			/>
			{listStore.selectedList !== 'movies' && (
				<ListItemText
					primary={item.progress}
					sx={{ flex: 2, textAlign: 'center' }}
				/>
			)}

			<Menu
				open={!!contextMenu}
				onClose={() => setContextMenu(null)}
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
						setEditableItemIndex(editableItemIndex === null ? index : null)
					}}
				>
					<ListItemText>Send to</ListItemText>
					{editableItemIndex === null ? <ExpandMoreIcon /> : <ExpandLessIcon />}
				</MenuItem>
				<Collapse in={editableItemIndex !== null}>
					<List
						disablePadding
						dense
						sx={{ '.MuiListItemButton-root': { textAlign: 'center' } }}
					>
						{listStore.pageOptions.rankPages.map((page) => {
							return (
								<ListItemButton
									key={page.value}
									disabled={page.value === listStore.selectedPage}
									onClick={() => onSendTo(page.value)}
								>
									<ListItemText primary={page.displayName} />
								</ListItemButton>
							)
						})}
						{listStore.pageOptions.extraPages.map((page) => {
							return (
								<ListItemButton
									key={page.value}
									disabled={page.value === listStore.selectedPage}
									onClick={() => onSendTo(page.value)}
								>
									<ListItemText primary={page.displayName} />
								</ListItemButton>
							)
						})}
					</List>
				</Collapse>
			</Menu>
		</Box>
	)
}

const ItemList = () => {
	const { listStore } = useStoreContext()

	return (
		<List sx={{ m: 0, p: 0, '.MuiListItemText-root': { paddingBlock: 0.5 } }}>
			{listStore.items.map((item, index) => (
				<ListItem key={`${index}-${item.name}`} index={index} item={item} />
			))}
		</List>
	)
}

export default observer(ItemList)
