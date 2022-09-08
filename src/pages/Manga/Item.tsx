import { Box, ListItemText, Menu, MenuItem } from '@mui/material'
import useLongPress from 'hooks/useLongPress'
import { useState } from 'react'

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
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const open = Boolean(anchorEl)

	const onLongPress = () => {
		console.log('longpress is triggered')
	}

	return (
		<Box
			{...useLongPress(onLongPress)}
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
			<ListItemText primary={name} sx={{ flex: 8, pl: 1 }} />
			<ListItemText primary={chapter} sx={{ flex: 2, textAlign: 'center' }} />
			<Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
				<MenuItem onClick={() => setAnchorEl(null)}>Profile</MenuItem>
				<MenuItem onClick={() => setAnchorEl(null)}>My account</MenuItem>
				<MenuItem onClick={() => setAnchorEl(null)}>Logout</MenuItem>
			</Menu>
		</Box>
	)
}

export default Item
