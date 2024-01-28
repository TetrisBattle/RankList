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
	const { firebaseStore, itemStore } = useStore()

	useEffect(() => {
		const authChangeListener = async () => {
			await firebaseStore.onAuthChange((items) => {
				itemStore.setItems(items)
			})
		}
		authChangeListener()
	}, [firebaseStore, itemStore])

	function writeDatas() {
		firebaseStore.writeDatas('mangas', mangasData)
		firebaseStore.writeDatas('movies', moviesData)
		firebaseStore.writeDatas('series', seriesData)
	}

	return (
		<>
			<Box
				sx={{
					maxWidth: (theme) => theme.breakpoints.values.md,
					marginInline: 'auto',
				}}
			>
				{firebaseStore.currentUser ? (
					<>
						<TopBar />
						<Button
							onClick={() => {
								// firebase.temp()
								// writeDatas()
							}}
						>
							Temp
						</Button>
						<PageList />
					</>
				) : (
					<Button
						onClick={() => firebaseStore.login()}
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
