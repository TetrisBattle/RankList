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
import useLongPress from 'hooks/useLongPress'
import { useStoreContext } from 'stores/StoreContext'
import { Item } from 'stores/ListStore'

const ItemList = () => {
	const { listStore, dialogStore } = useStoreContext()
	const itemRef: React.MutableRefObject<HTMLElement | null> = useRef(null)
	const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)

	const onCopy = (item: Item) => {
		navigator.clipboard.writeText(`${item.name} chapter ${item.progress}`)
		setMenuAnchor(null)
	}

	const onEdit = (item: Item) => {
		dialogStore.dialogType = 'edit'
		dialogStore.name = item.name
		dialogStore.progress = item.progress
		dialogStore.openDialog = true
		setMenuAnchor(null)
	}

	const onDelete = (item: Item) => {
		listStore.delete(item.name)
		setMenuAnchor(null)
	}

	const ListItem = ({ counter, item }: { counter: number, item: Item }) => (
		<Box
			{...useLongPress(() => setMenuAnchor(itemRef.current))}
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
			<ListItemText primary={counter} sx={{ flex: 1, textAlign: 'center' }} />
			<ListItemText primary={item.name} ref={itemRef} sx={{ flex: 8, pl: 1 }} />
			<ListItemText primary={item.progress} sx={{ flex: 2, textAlign: 'center' }} />
			<Menu
				anchorEl={menuAnchor}
				open={!!menuAnchor}
				onClose={() => setMenuAnchor(null)}
			>
				<MenuItem onClick={() => onCopy(item)}>
					<ListItemIcon>
						<ContentCopyIcon fontSize='small' />
					</ListItemIcon>
					<ListItemText>Copy</ListItemText>
				</MenuItem>
				<MenuItem onClick={() => onEdit(item)}>
					<ListItemIcon>
						<EditIcon fontSize='small' />
					</ListItemIcon>
					<ListItemText>Edit</ListItemText>
				</MenuItem>
				<MenuItem onClick={() => onDelete(item)}>
					<ListItemIcon>
						<DeleteIcon fontSize='small' />
					</ListItemIcon>
					<ListItemText>Delete</ListItemText>
				</MenuItem>
			</Menu>
		</Box>
	)

	return (
		<List sx={{ m: 0, p: 0, '& .MuiListItemText-root': { paddingBlock: 0.5 } }}>
			{listStore.items.map((item, counter) => (
				<ListItem key={item.name} counter={counter + 1} item={item} />
			))}
		</List>
	)
}

export default ItemList
