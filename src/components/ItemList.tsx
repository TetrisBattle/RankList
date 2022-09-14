import { useState, useRef } from 'react'
import {
	Box,
	List,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useStoreContext } from 'stores/StoreContext'
import { Item } from 'stores/ListStore'
import { observer } from 'mobx-react-lite'

const ListItem = ({ index, item }: { index: number; item: Item }) => {
	const { listStore } = useStoreContext()
	const itemRef: React.MutableRefObject<HTMLElement | null> = useRef(null)
	const [contextMenu, setContextMenu] = useState<{
		mouseX: number
		mouseY: number
	} | null>(null)

	const onCopy = (item: Item) => {
		navigator.clipboard.writeText(`${item.name} chapter ${item.progress}`)
		setContextMenu(null)
	}

	const onEdit = (item: Item, index: number) => {
		listStore.dialogType = 'edit'
		listStore.dialogItem = item
		listStore.editableItemIndex = index
		listStore.dialogOpen = true
		setContextMenu(null)
	}

	const onDelete = (index: number) => {
		listStore.editableItemIndex = index
		listStore.delete()
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
				'& .MuiListItemText-root': {
					bgcolor: (theme) => theme.palette.secondary.main,
					mt: 0,
				},
			}}
		>
			<ListItemText primary={index + 1} sx={{ flex: 1, textAlign: 'center' }} />
			<ListItemText
				primary={item.name}
				ref={itemRef}
				sx={{ flex: listStore.currentList !== 'movies' ? 10 : 8, pl: 1 }}
			/>
			{listStore.currentList !== 'movies' && (
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
			</Menu>
		</Box>
	)
}

const ItemList = () => {
	const { listStore } = useStoreContext()

	return (
		<List sx={{ m: 0, p: 0, '& .MuiListItemText-root': { paddingBlock: 0.5 } }}>
			{listStore.items.map((item, index) => (
				<ListItem key={`${index}-${item.name}`} index={index} item={item} />
			))}
		</List>
	)
}

export default observer(ItemList)
