import { observer } from 'mobx-react-lite'
import { Box, Button } from '@thng/react'
import { useStore } from 'hooks/useStore'
import { TopBar } from 'components/TopBar'
import { PageList } from 'components/PageList'
import { ItemDialog } from 'components/ItemDialog'
import { useEffect } from 'react'
import { moviesData } from 'backup/moviesData'
import { seriesData } from 'backup/seriesData'
import { mangasData } from 'backup/mangasData'
export const App = observer(() => {
	const { FirebaseStore, listStore } = useStore()

	useEffect(() => {
		const unsub = FirebaseStore.onAuthChange()
		return () => unsub()
	}, [FirebaseStore])

	function postDatas() {
		FirebaseStore.postDatas('mangas', mangasData)
		FirebaseStore.postDatas('movies', moviesData)
		FirebaseStore.postDatas('series', seriesData)
	}

	return (
		<>
			<Box
				sx={{
					maxWidth: (theme) => theme.breakpoints.values.md,
					marginInline: 'auto',
				}}
			>
				{FirebaseStore.currentUser ? (
					<>
						<TopBar />
						<Button
							onClick={() => {
								// firebase.temp()
								// postDatas()
							}}
						>
							Temp
						</Button>
						<PageList />
					</>
				) : (
					<Button
						onClick={() => FirebaseStore.login()}
						sx={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							fontWeight: 600,
						}}
					>
						Log in with Google
					</Button>
				)}
			</Box>
			<ItemDialog />
		</>
	)
})
