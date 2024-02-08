import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from '@thng/react'

type ConfirmDialogProps = {
	open: boolean
	onConfirm: () => void
	onCancel: () => void
	title: string
	content: string
}

export const ConfirmDialog = ({
	open,
	onConfirm,
	onCancel,
	title,
	content,
}: ConfirmDialogProps) => {
	return (
		<Dialog
			open={open}
			title='Delete'
			content='Are you sure you want to delete this item?'
		>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>
				<DialogContentText>{content}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onConfirm}>Yes</Button>
				<Button onClick={onCancel}>No</Button>
			</DialogActions>
		</Dialog>
	)
}
