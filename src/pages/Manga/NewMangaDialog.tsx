import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
} from '@mui/material'

const NewMangaDialog = ({
	open,
	setOpen,
}: {
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
	return (
		<Box>
			<Dialog open={open} onClose={() => setOpen(false)}>
				<DialogTitle sx={{ textAlign: 'center' }}>New Manga</DialogTitle>
				<DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
					<TextField
						label={'Name'}
						color={'info'}
						size={'small'}
						sx={{ mt: 1 }}
					/>
					<TextField
						label={'Chapter'}
						type={'number'}
						size={'small'}
						sx={{
							mt: 2,
							'& .MuiTextField-root::-webkit-inner-spin-button, .MuiTextField-root::-webkit-outer-spin-button':
								{
									WebkitAppearance: 'none',
									margin: 0,
								},
						}}
					/>
				</DialogContent>
				<DialogActions>
					<Button>Cancel</Button>
					<Button>Save</Button>
				</DialogActions>
			</Dialog>
		</Box>
	)
}

export default NewMangaDialog
