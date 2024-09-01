import {
	Autocomplete,
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	Grid,
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
import { Item } from 'models/Item'

export const ItemDialog = observer(() => {
	const { appStore } = useStore()
	const [existingItem, setExistingItem] = useState<Item | null>(null)
	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting, isValid, isDirty },
		reset,
	} = useForm<ItemFormData>({
		mode: 'all',
		values: {
			name: appStore.selectedItem.name,
			progress: appStore.selectedItem.progress,
			rank: appStore.selectedItem.rank,
			completed: appStore.selectedItem.completed,
		},
		resolver: zodResolver(itemSchema),
	})

	const onClose = () => {
		appStore.setItemDialogOpen(false)
		setExistingItem(null)
		reset()
	}

	const onSubmit = handleSubmit(async (itemFormData: ItemFormData) => {
		appStore.selectedItem.setFormData(itemFormData)
		const item = appStore.selectedItem.copy()

		if (item.id) await appStore.edit(item)
		else await appStore.add(item)

		onClose()
	})

	const onSelect = (item: Item) => {
		if (item.id === appStore.selectedItem.id) setExistingItem(null)
		else setExistingItem(item)
	}

	const onChange = (name: string) => {
		const itemWithSameName = appStore.sortedListItems.find((i) => {
			if (i.id === appStore.selectedItem.id) return false
			return i.name.toLowerCase() === name.toLowerCase()
		})
		setExistingItem(itemWithSameName || null)
	}

	const disableSaveButton =
		!isValid || isSubmitting || !isDirty || !!existingItem

	return (
		<Dialog
			PaperProps={{ component: 'form' }}
			open={appStore.itemDialogOpen}
			onSubmit={onSubmit}
			fullWidth
			maxWidth='xs'
		>
			<DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
				{appStore.selectedItem.id ? 'Edit' : 'Add'}
			</DialogTitle>

			<DialogContent>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<Controller
							control={control}
							name='name'
							render={({ field }) => (
								<Autocomplete
									value={field.value}
									onChange={(_e, item) => {
										if (!(item instanceof Item)) return
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
									options={appStore.sortedListItems.filter(
										(item) => item.rank !== 'Z'
									)}
									getOptionLabel={(option) =>
										typeof option === 'string'
											? option
											: option.name
									}
									freeSolo
								/>
							)}
						/>
					</Grid>
					<Grid item xs={6}>
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
					</Grid>
					{!appStore.isSecretCode && (
						<Grid item xs={6}>
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
						</Grid>
					)}
					<Grid item xs={12}>
						<Controller
							control={control}
							name='completed'
							render={({ field }) => (
								<FormControlLabel
									label='Completed'
									control={
										<Checkbox
											{...field}
											checked={field.value}
										/>
									}
								/>
							)}
						/>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				{existingItem && (
					<Button
						onClick={() => {
							appStore.setSelectedItem(existingItem)
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
