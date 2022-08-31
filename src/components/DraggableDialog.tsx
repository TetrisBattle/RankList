import { useRef } from 'react'
import {
	Dialog,
	DialogProps,
	DialogTitle,
	Paper,
	PaperProps,
	IconButton,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import Draggable from 'react-draggable'

const PaperComponent = (paperProps: PaperProps) => {
	const nodeRef = useRef(null)

	return (
		<Draggable
			nodeRef={nodeRef}
			handle='.MuiDialogTitle-root'
			cancel={'[class*="MuiDialogContent-root"]'}
			bounds='parent'
		>
			<Paper ref={nodeRef} {...paperProps} sx={{ margin: '0 !important' }} />
		</Draggable>
	)
}

interface Props extends DialogProps {
	title: string
	onClose:
		| ((event: {}, reason?: 'backdropClick' | 'escapeKeyDown') => void)
		| undefined
}

const DraggableDialog = (props: Props) => {
	const { title, children, ...baseProps } = props

	return (
		<>
			<Dialog
				PaperComponent={PaperComponent}
				fullWidth={true}
				maxWidth='sm'
				{...baseProps}
				sx={{
					'& .MuiDialogContent-root': {
						padding: '16px !important',
					},
					'& .MuiDialogActions-root': {
						padding: '16px !important',
					},
				}}
			>
				<DialogTitle
					sx={(theme) => ({
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						backgroundColor: theme.palette.primary.main,
						color: theme.palette.primary.contrastText,
						fontWeight: 'bold',
						padding: '8px 8px 8px 16px',
						cursor: 'grab',
						'& .MuiIconButton-root': {
							color: 'inherit',
						},
					})}
				>
					{title}
					<IconButton onClick={props.onClose}>
						<CloseIcon />
					</IconButton>
				</DialogTitle>
				{children}
			</Dialog>
		</>
	)
}

export default DraggableDialog
