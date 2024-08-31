import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	observer,
	Typography,
} from '@thng/react'
import { useStore } from 'hooks/useStore'

const StatusInfoBox = ({ color, info }: { color: string; info: string }) => {
	return (
		<Box
			sx={{
				display: 'flex',
				gap: 1,
				alignItems: 'center',
			}}
		>
			<Box
				sx={{
					width: 16,
					height: 16,
					bgcolor: color,
				}}
			/>
			<Typography>{info}</Typography>
		</Box>
	)
}

export const InfoDialog = observer(() => {
	const { appStore } = useStore()

	return (
		<Dialog open={appStore.statusInfoDialogOpen} fullWidth maxWidth='xs'>
			<DialogTitle sx={{ textAlign: 'center', pb: 0 }}>Info</DialogTitle>

			<DialogContent>
				<StatusInfoBox color='hsl(180, 100%, 40%)' info='Complete' />
				<StatusInfoBox
					color='hsl(100, 100%, 40%)'
					info='Updated recently'
				/>
				<StatusInfoBox
					color='hsl(50, 100%, 45%)'
					info='Updated 3 months ago '
				/>
				<StatusInfoBox
					color='hsl(35, 100%, 45%)'
					info='Updated 6 months ago'
				/>
				<StatusInfoBox
					color='hsl(0, 100%, 40%)'
					info='Updated a year ago'
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => appStore.setStatusInfoDialogOpen(false)}>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	)
})
