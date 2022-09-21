import { useState, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { Box, List, ListItemText } from '@mui/material'
import { useStoreContext } from 'stores/StoreContext'
import ItemContextMenu from './ItemContextMenu'
import { Item } from 'types'

const PageItem = ({ index, item }: { index: number; item: Item }) => {
	const { listStore } = useStoreContext()
	const itemRef: React.MutableRefObject<HTMLElement | null> = useRef(null)
	const [contextMenu, setContextMenu] = useState<{
		mouseX: number
		mouseY: number
	} | null>(null)

	const handleContextMenu = (event: React.MouseEvent) => {
		event.preventDefault()
		setContextMenu(
			contextMenu
				? null
				: {
						mouseX: event.clientX,
						mouseY: event.clientY,
				  }
		)
	}

	return (
		<Box
			onContextMenu={handleContextMenu}
			sx={{
				display: 'flex',
				gap: 0.5,
				width: 1,
				justifyContent: 'center',
				'.MuiListItemText-root': {
					bgcolor: (theme) => theme.palette.secondary.main,
					mt: 0,
				},
			}}
		>
			<ListItemText primary={index + 1} sx={{ flex: 1, textAlign: 'center' }} />
			<ListItemText
				primary={item.name}
				ref={itemRef}
				sx={{ flex: listStore.selectedList !== 'movies' ? 10 : 8, pl: 1 }}
			/>
			{listStore.selectedList !== 'movies' && (
				<ListItemText
					primary={item.progress}
					sx={{ flex: 2, textAlign: 'center' }}
				/>
			)}
			<ItemContextMenu
				contextMenu={contextMenu}
				setContextMenu={setContextMenu}
				index={index}
				item={item}
			/>
		</Box>
	)
}

const PageList = () => {
	const { listStore } = useStoreContext()

	return (
		<List sx={{ m: 0, p: 0, '.MuiListItemText-root': { paddingBlock: 0.5 } }}>
			{listStore.selectedPageItems.map((item, index) => (
				<PageItem key={`${index}-${item.name}`} index={index} item={item} />
			))}
		</List>
	)
}

export default observer(PageList)
