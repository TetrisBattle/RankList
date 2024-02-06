import { Box, Menu, MenuItem, Typography, observer } from '@thng/react'
import { useStore } from 'hooks/useStore'
import { useState } from 'react'
import { Table, tableOptions } from 'stores/FirebaseStore'

export const ListMenu = observer(() => {
	const { appStore } = useStore()
	const [listMenuAnchor, setListMenuAnchor] = useState<HTMLElement | null>(
		null
	)

	const getListLabel = (list: Table) => {
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
					{getListLabel(appStore.selectedList)}
				</Typography>
			</Box>
			<Menu
				anchorEl={listMenuAnchor}
				open={!!listMenuAnchor}
				onClose={() => setListMenuAnchor(null)}
			>
				{tableOptions.map((option) => (
					<MenuItem
						key={option}
						selected={option === appStore.selectedList}
						onClick={async () => {
							setListMenuAnchor(null)

							appStore.setSelectedList(option)
							if (appStore.listItmes.length === 0) {
								await appStore.fetch(option)
							}

							if (option === 'movies') {
								appStore.setDisplayProgress(false)
							} else appStore.setDisplayProgress(true)
						}}
					>
						{getListLabel(option)}
					</MenuItem>
				))}
			</Menu>
		</>
	)
})
