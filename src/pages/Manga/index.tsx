import { observer } from 'mobx-react-lite'
import {
	Box,
	List,
} from '@mui/material'
import { useStoreContext } from 'stores/StoreContext'
import TopBar from './TopBar'
import Item from './Item'

const Manga = () => {
	const { mangaStore } = useStoreContext()

	return (
		<Box sx={{ maxWidth: 1200, marginInline: 'auto' }}>
			<TopBar />
			<List
				sx={{ m: 0, p: 0, '& .MuiListItemText-root': { paddingBlock: 0.5 } }}
			>
				<Item counter={1} name={'Solo Leveling'} chapter={'1234'} />
				<Item
					counter={2}
					name={'The Beginning After The End'}
					chapter={'64'}
				/>
			</List>
		</Box>
	)
}

export default observer(Manga)
