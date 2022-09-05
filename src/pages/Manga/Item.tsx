import { Box, ListItemText } from '@mui/material'

const Item = ({
	counter,
	name,
	chapter,
}: {
	counter: number
	name: string
	chapter: string
}) => {
	return (
		<Box
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
		</Box>
	)
}

export default Item
