import {
	Autocomplete,
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
	const { itemStore } = useStore()
	const [existingItem, setExistingItem] = useState<Item | null>(null)
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

	const onClose = () => {
		itemStore.setDialogOpen(false)
		setExistingItem(null)
		reset()
	}

	const onSubmit = handleSubmit(async (itemFormData: ItemFormData) => {
		const item = itemStore.selectedItem.getCopyWithFormData(itemFormData)

		if (item.id) await itemStore.edit(item)
		else await itemStore.add(item)

		onClose()
	})

	const onSelect = (item: Item) => {
		if (item.id === itemStore.selectedItem.id) setExistingItem(null)
		else setExistingItem(item)
	}

	const onChange = (name: string) => {
		const itemWithSameName = itemStore.items.find((i) => {
			if (i.id === itemStore.selectedItem.id) return false
			return i.name.toLowerCase() === name.toLowerCase()
		})
		setExistingItem(itemWithSameName || null)
	}

	const disableSaveButton =
		!isValid || isSubmitting || !isDirty || !!existingItem

	return (
		<Dialog
			PaperProps={{ component: 'form' }}
			open={itemStore.dialogOpen}
			onSubmit={onSubmit}
			fullWidth
			maxWidth='xs'
		>
			<DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
				{itemStore.selectedItem.id ? 'Edit' : 'Add'}
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
						<Autocomplete
							value={field.value}
							onChange={(_e, item) => {
								if (!item) return
								if (typeof item === 'string') throw new Error()
								field.onChange(item.name)
								onSelect(item)
							}}
							renderInput={(params) => {
								return (
									<TextField
										{...params}
										{...field}
										label='Name'
										error={!!errors.name}
										onChange={(e) => {
											field.onChange(e)
											onChange(e.target.value)
										}}
										sx={{ mt: 2 }}
									/>
								)
							}}
							options={itemStore.items}
							getOptionLabel={(option) =>
								typeof option === 'string'
									? option
									: option.name
							}
							freeSolo
						/>
					)}
				/>

				<Controller
					control={control}
					name='progress'
					render={({ field }) => (
						<TextField
							{...field}
							label={`Progress ${existingItem?.progress || ''}`}
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
							label={`Rank ${existingItem?.rank || ''}`}
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
						}}
					>
						Edit
					</Button>
				)}
				<Button type='submit' disabled={disableSaveButton}>
					Save
				</Button>
				<Button onClick={onClose}>Cancel</Button>
			</DialogActions>
		</Dialog>
	)
})
