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
import { ItemFormData, itemSchema } from './itemValidation'
import { rankOptions } from 'stores/FirebaseStore'
import { useState } from 'react'
import { Item } from 'stores/itemStore/Item'

export const ItemDialog = observer(() => {
	const { appStore, itemStore } = useStore()
	const [existingItem, setExistingItem] = useState<Item | null>(null)
	const [nameErrorText, setNameErrorText] = useState('')
	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting, isValid, isDirty },
		reset,
	} = useForm<ItemFormData>({
		mode: 'all',
		values: {
			name: itemStore.selectedItem.name,
			progress: itemStore.selectedItem.progress,
			rank: itemStore.selectedItem.rank,
		},
		resolver: zodResolver(itemSchema),
	})

	const onSubmit = handleSubmit(async (itemFormData: ItemFormData) => {
		const item = itemStore.selectedItem.getCopyWithFormData(itemFormData)

		const itemWithSameName = itemStore.items.find((i) => {
			if (i.id === item.id) return false
			return i.name.toLowerCase() === item.name.toLowerCase()
		})

		if (itemWithSameName) {
			setExistingItem(itemWithSameName)
			setNameErrorText(
				`Item already exists in page ${itemWithSameName.rank}`
			)
			return
		}

		if (item.id) await itemStore.edit(item)
		else await itemStore.add(item)

		itemStore.setDialogOpen(false)
		reset()
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
							error={!!errors.name || !!nameErrorText}
							helperText={nameErrorText}
							multiline
							onChange={(e) => {
								field.onChange(e)
								if (existingItem) {
									setExistingItem(null)
									setNameErrorText('')
								}
							}}
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
				{existingItem && (
					<Button
						onClick={() => {
							itemStore.setSelectedItem(existingItem)
							setExistingItem(null)
							setNameErrorText('')
						}}
					>
						Edit
					</Button>
				)}
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
