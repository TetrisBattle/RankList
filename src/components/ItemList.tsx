import { List } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useStoreContext } from 'stores/StoreContext'
import Item from './Item'

const ItemList = () => {
	const { userStore, listStore } = useStoreContext()

	useEffect(() => {
		listStore.updateList()
	}, [listStore, listStore.activePage, userStore.dbPath])

	return (
		<List sx={{ m: 0, p: 0, '& .MuiListItemText-root': { paddingBlock: 0.5 } }}>
			{listStore.items.map((item, counter) => (
				<Item
					key={item.name}
					counter={counter + 1}
					name={item.name}
					progress={item.progress}
				/>
			))}
		</List>
	)
}

export default observer(ItemList)
