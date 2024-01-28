import { observer } from 'mobx-react-lite'
import { Box, Button } from '@thng/react'
import { useStore } from 'hooks/useStore'
import { ItemDialog } from 'components/ItemDialog'
import { useEffect } from 'react'
import { TopBar } from 'features/topBar/TopBar'
import { PageItems } from 'features/pageItems/PageItems'

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
						<PageItems />
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
