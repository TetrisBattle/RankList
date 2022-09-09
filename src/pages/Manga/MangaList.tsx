import { List } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useStoreContext } from 'stores/StoreContext'
import Item from './Item'

const MangaList = () => {
	const { mangaStore } = useStoreContext()

	useEffect(() => {
		mangaStore.updateMangaList()
	}, [mangaStore, mangaStore.activePage, mangaStore.mangaPath])

	return (
		<List sx={{ m: 0, p: 0, '& .MuiListItemText-root': { paddingBlock: 0.5 } }}>
			{mangaStore.mangas.map((manga, counter) => (
				<Item
					key={manga.id}
					id={manga.id}
					counter={counter + 1}
					name={manga.name}
					chapter={manga.chapter}
				/>
			))}
		</List>
	)
}

export default observer(MangaList)
