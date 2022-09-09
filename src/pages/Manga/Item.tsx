import { useState, useRef } from 'react'
import { Box, ListItemText, Menu, MenuItem } from '@mui/material'
import useLongPress from 'hooks/useLongPress'
import { useStoreContext } from 'stores/StoreContext'

const Item = ({
	id,
	counter,
	name,
	chapter,
}: {
	id: string
	counter: number
	name: string
	chapter: string
}) => {
	const itemRef: React.MutableRefObject<HTMLElement | null> = useRef(null)
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
	const open = Boolean(anchorEl)
	const { mangaStore, mangaDialogStore } = useStoreContext()

	const onEdit = () => {
		mangaDialogStore.dialogType = 'edit'
		mangaDialogStore.mangaId = id
		mangaDialogStore.mangaName = name
		mangaDialogStore.mangaChapter = chapter
		mangaDialogStore.openDialog = true
		setAnchorEl(null)
	}

	const onCopy = () => {
		navigator.clipboard.writeText(`${name} chapter ${chapter}`)
		setAnchorEl(null)
	}

	const onDelete = () => {
		mangaStore.delete(id)
		setAnchorEl(null)
	}

	return (
		<Box
			{...useLongPress(() => setAnchorEl(itemRef.current))}
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
			<ListItemText primary={chapter} sx={{ flex: 2, textAlign: 'center' }} />
			<Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
				<MenuItem onClick={onEdit}>Edit</MenuItem>
				<MenuItem onClick={onCopy}>Copy</MenuItem>
				<MenuItem onClick={onDelete}>Delete</MenuItem>
			</Menu>
		</Box>
	)
}

export default Item
