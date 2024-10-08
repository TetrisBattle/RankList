import { Box, Button, CircularProgress, observer } from '@thng/react'
import { useStore } from 'hooks/useStore'
import { useEffect } from 'react'
import { TopBar } from 'features/topBar/TopBar'
import { PageItems } from 'features/pageItems/PageItems'
import { ItemDialog } from 'features/itemDialog/ItemDialog'
import { useSetupTheme } from 'hooks/useSetupTheme'
import { InfoDialog } from 'features/InfoDialog'

export const App = observer(() => {
	const { firebaseStore, appStore } = useStore()
	useSetupTheme()

	useEffect(() => {
		const authChangeListener = async () => {
			await firebaseStore.onAuthChange(async (user) => {
				if (user) await appStore.fetchListItems()
				else appStore.reset()
			})
		}
		authChangeListener()
	}, [firebaseStore, appStore])

	if (firebaseStore.isLoading) {
		return (
			<Box
				sx={{
					height: '100dvh',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<CircularProgress />
			</Box>
		)
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
			<InfoDialog />
		</>
	)
})
