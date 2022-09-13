import { useState, useRef } from 'react'
import { Box, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import useLongPress from 'hooks/useLongPress'
import { useStoreContext } from 'stores/StoreContext'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

const Item = ({
	counter,
	name,
	progress,
}: {
	counter: number
	name: string
	progress: string
}) => {
	const { userStore, listStore, dialogStore } = useStoreContext()
	const itemRef: React.MutableRefObject<HTMLElement | null> = useRef(null)
	const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)

	const onCopy = () => {
		navigator.clipboard.writeText(`${name} chapter ${progress}`)
		setMenuAnchor(null)
	}

	const onEdit = () => {
		dialogStore.dialogType = 'edit'
		dialogStore.name = name
		dialogStore.progress = progress
		dialogStore.openDialog = true
		setMenuAnchor(null)
	}

	const onDelete = () => {
		listStore.delete(name)
		setMenuAnchor(null)
	}

	return (
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
			<ListItemText primary={name} ref={itemRef} sx={{ flex: 8, pl: 1 }} />
			<ListItemText primary={progress} sx={{ flex: 2, textAlign: 'center' }} />
			<Menu
				anchorEl={menuAnchor}
				open={!!menuAnchor}
				onClose={() => setMenuAnchor(null)}
			>
				<MenuItem onClick={onCopy}>
					<ListItemIcon>
						<ContentCopyIcon fontSize='small' />
					</ListItemIcon>
					<ListItemText>Copy</ListItemText>
				</MenuItem>
				{userStore.currentUser && (
					<MenuItem onClick={onEdit}>
						<ListItemIcon>
							<EditIcon fontSize='small' />
						</ListItemIcon>
						<ListItemText>Edit</ListItemText>
					</MenuItem>
				)}
				{userStore.currentUser && (
					<MenuItem onClick={onDelete}>
						<ListItemIcon>
							<DeleteIcon fontSize='small' />
						</ListItemIcon>
						<ListItemText>Delete</ListItemText>
					</MenuItem>
				)}
			</Menu>
		</Box>
	)
}

export default Item
