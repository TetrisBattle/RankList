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

	const getLabel = (list: Table) => {
		switch (list) {
			case 'mangas':
				return 'MangaList'
			case 'movies':
				return 'Movies'
			case 'series':
				return 'Series'
		}
	}

	return (
		<>
			<Box
				onClick={(e) => setListMenuAnchor(e.currentTarget)}
				sx={{ display: 'flex', alignItems: 'center', flex: 4 }}
			>
				<Typography
					sx={{
						mx: 1,
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
					{getLabel(appStore.selectedList)}
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
						onClick={() => {
							appStore.setSelectedList(option)
							itemStore.fetch(option)
							setListMenuAnchor(null)
						}}
					>
						{option}
					</MenuItem>
				))}
			</Menu>
		</>
	)
}
