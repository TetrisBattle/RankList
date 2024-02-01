import { Box, Menu, MenuItem, Typography } from '@thng/react'
import { useStore } from 'hooks/useStore'
import { useState } from 'react'
import { Table } from 'stores/FirebaseStore'

export const ListMenu = () => {
	const { appStore, itemStore } = useStore()
	const [listMenuAnchor, setListMenuAnchor] = useState<HTMLElement | null>(
		null
	)

	const listOptions: Table[] = ['mangas', 'movies', 'series']

	return (
		<>
			<Box sx={{ display: 'flex', alignItems: 'center', flex: 4 }}>
				<Typography
					onClick={(e) => setListMenuAnchor(e.currentTarget)}
					sx={{
						px: 1,
						fontSize: 22,
						color: (theme) =>
							listMenuAnchor
								? theme.palette.primary.light
								: 'inherit',
						':hover': {
							cursor: 'pointer',
							color: (theme) => theme.palette.primary.light,
						},
					}}
				>
					{appStore.selectedListLabel}
				</Typography>
			</Box>
			<Menu
				anchorEl={listMenuAnchor}
				open={!!listMenuAnchor}
				onClose={() => setListMenuAnchor(null)}
			>
				{listOptions.map((option) => (
					<MenuItem
						key={option}
						selected={option === appStore.selectedList}
						onClick={async () => {
							setListMenuAnchor(null)

							await itemStore.fetch(option)

							appStore.setSelectedList(option)

							if (option === 'movies') {
								itemStore.setDisplayProgress(false)
							} else itemStore.setDisplayProgress(true)
						}}
					>
						{option}
					</MenuItem>
				))}
			</Menu>
		</>
	)
}
