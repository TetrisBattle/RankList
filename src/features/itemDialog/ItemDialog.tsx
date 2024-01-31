import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	MenuItem,
	TextField,
	observer,
} from '@thng/react'
import { useStore } from 'hooks/useStore'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ItemForm, itemSchema } from './itemValidation'
import { rankOptions } from 'stores/FirebaseStore'

export const ItemDialog = observer(() => {
	const { appStore, itemStore } = useStore()
	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting, isValid, isDirty },
		reset,
	} = useForm<ItemForm>({
		mode: 'all',
		values: {
			name: itemStore.selectedItem.name,
			progress: itemStore.selectedItem.progress,
			rank: itemStore.selectedItem.rank,
		},
		resolver: zodResolver(itemSchema),
	})

	const onSubmit = handleSubmit(async (item: ItemForm) => {
		await itemStore.save(item).then(() => {
			itemStore.setDialogOpen(false)
		})
	})

	return (
		<Dialog
			PaperProps={{ component: 'form' }}
			open={itemStore.dialogOpen}
			onSubmit={onSubmit}
			fullWidth
			maxWidth='xs'
		>
			<DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
				{appStore.selectedListLabel}
			</DialogTitle>

			<DialogContent
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: 2,
				}}
			>
				<Controller
					control={control}
					name='name'
					render={({ field }) => (
						<TextField
							{...field}
							label='Name'
							error={!!errors.name}
							multiline
							sx={{ mt: 2 }}
						/>
					)}
				/>

				<Controller
					control={control}
					name='progress'
					render={({ field }) => (
						<TextField
							{...field}
							label='Progress'
							error={!!errors.progress}
						/>
					)}
				/>

				<Controller
					control={control}
					name='rank'
					render={({ field }) => (
						<TextField
							{...field}
							label='Rank'
							error={!!errors.rank}
							value={field.value}
							select
						>
							{rankOptions.map((rank) => (
								<MenuItem key={rank} value={rank}>
									{rank}
								</MenuItem>
							))}
						</TextField>
					)}
				/>
			</DialogContent>
			<DialogActions>
				<Button
					type='submit'
					disabled={!isValid || isSubmitting || !isDirty}
				>
					Save
				</Button>
				<Button
					onClick={() => {
						itemStore.setDialogOpen(false)
						reset()
					}}
				>
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	)
})
