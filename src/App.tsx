import { observer } from 'mobx-react-lite'
import { Box, Button } from '@thng/react'
import { useStore } from 'hooks/useStore'
import { TopBar } from 'components/TopBar'
import { PageList } from 'components/PageList'
import { ItemDialog } from 'components/ItemDialog'
import { useAuth } from 'hooks/useAuth'

function LoginButton() {
	const { firebase } = useStore()

	return (
		<Button
			onClick={() => firebase.login()}
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
	)
}

export const App = observer(() => {
	const { listStore } = useStore()
	const initialized = useAuth()
	if (!initialized) return <div></div>

	return (
		<>
			<Box
				sx={{
					maxWidth: (theme) => theme.breakpoints.values.md,
					marginInline: 'auto',
				}}
			>
				{listStore.userId === 'Guest' ? (
					<LoginButton />
				) : (
					<>
						<TopBar />
						<PageList />
					</>
				)}
			</Box>
			<ItemDialog />
		</>
	)
})
