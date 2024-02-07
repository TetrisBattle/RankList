import { List, ListItem, Typography, observer } from '@thng/react'
import { useStore } from 'hooks/useStore'
import { ItemContextMenu } from './ItemContextMenu'
import { useState } from 'react'

export const PageItems = observer(() => {
	const { appStore } = useStore()
	const [contextPos, setContextPos] = useState({
		left: 0,
		top: 0,
	})

	const pageItems = appStore.sortedListItems.filter(
		(item) => item.rank === appStore.selectedPage
	)

	return (
		<>
			<List sx={{ p: 0, gap: 0.5 }}>
				{pageItems.map((item, index) => (
					<ListItem
						key={item.id}
						onContextMenu={(e) => {
							e.preventDefault()

							if (contextPos.left && contextPos.top) {
								setContextPos({ left: 0, top: 0 })
								return
							}

							appStore.setSelectedItem(item)
							setContextPos({ left: e.clientX, top: e.clientY })
						}}
						disablePadding
						sx={{
							alignItems: 'normal',
							userSelect: 'none',
							'.MuiTypography-root': {
								bgcolor: (theme) =>
									theme.palette.secondary.main,
								py: 0.5,
								m: 0.25,
							},
						}}
					>
						<Typography sx={{ flex: 1, textAlign: 'center' }}>
							{index + 1}
						</Typography>
						<Typography
							sx={{
								flex: appStore.displayProgress ? 4.5 : 6,
								px: 1,
							}}
						>
							{item.name}
						</Typography>
						{appStore.displayProgress && (
							<Typography sx={{ flex: 1.5, textAlign: 'center' }}>
								{item.progress}
							</Typography>
						)}
						<ItemContextMenu
							contextPos={contextPos}
							setContextPos={setContextPos}
						/>
					</ListItem>
				))}
			</List>
		</>
	)
})
