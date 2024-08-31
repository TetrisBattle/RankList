import { Box, List, ListItem, Typography, observer } from '@thng/react'
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
			<List sx={{ p: 0 }}>
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
						sx={{ mb: 0.5 }}
					>
						<Box
							sx={{
								width: 1,
								display: 'flex',
								gap: 0.5,
								'.MuiTypography-root': {
									bgcolor: (theme) =>
										theme.palette.secondary.main,
									py: 0.5,
								},
								userSelect: 'none',
							}}
						>
							<Box
								sx={{
									width: 8,
									bgcolor: item.completed
										? 'hsl(180, 100%, 40%)'
										: appStore.getStatus(
												item.updated ?? item.created
											),
								}}
							/>

							<Typography
								sx={{
									width: 50,
									textAlign: 'center',
								}}
							>
								{index + 1}
							</Typography>

							<Typography
								sx={{
									width: 1,
									px: 1,
								}}
							>
								{item.name}
							</Typography>

							{appStore.displayProgress && (
								<Typography
									sx={{
										width: 100,
										textAlign: 'center',
									}}
								>
									{item.progress}
								</Typography>
							)}
						</Box>
					</ListItem>
				))}
				<ItemContextMenu
					contextPos={contextPos}
					setContextPos={setContextPos}
				/>
			</List>
		</>
	)
})
