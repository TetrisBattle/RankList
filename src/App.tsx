import { useEffect, useMemo, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { Backdrop, Box, Button, CircularProgress } from '@thng/react'
import { useStore } from 'hooks/useStore'
import { TopBar } from 'components/TopBar'
import { PageList } from 'components/PageList'
import { ItemDialog } from 'components/ItemDialog'
import Firebase from 'gateway/Firebase'

export const App = observer(() => {
	const firebase = useMemo(() => new Firebase(), [])
	const { appStore, listStore } = useStore()
	const topBarRef = useRef<HTMLElement>()
	const topBarHeight = topBarRef.current?.clientHeight ?? 0

	useEffect(() => {
		firebase.onAuthChange((user) => {
			if (!user?.email) {
				listStore.setUserId('Guest')
				listStore.resetRankList()
				return
			}
			listStore.setUserId(user.email)
		})
	}, [firebase, appStore, listStore])

	useEffect(() => {
		if (listStore.userId === 'Guest') return
		appStore.setIsLoading(true)

		firebase.onDataChange(
			listStore.userId,
			listStore.selectedList,
			(dto) => {
				listStore.setupRankListFromDto(dto)
				appStore.setIsLoading(false)
			}
		)
	}, [
		firebase,
		appStore,
		listStore,
		listStore.userId,
		listStore.selectedList,
	])

	function LoginButton() {
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

	function RankList() {
		return (
			<>
				<TopBar topBarRef={topBarRef} />
				<Box sx={{ mt: topBarHeight / 8 }} />
				<PageList />
				{listStore.isLoading && (
					<Box
						sx={{
							mt: 2,
							display: 'flex',
							justifyContent: 'center',
						}}
					>
						<CircularProgress />
					</Box>
				)}
			</>
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
				{listStore.userId === 'Guest' ? <LoginButton /> : <RankList />}
			</Box>
			<ItemDialog />
			<Backdrop open={appStore.isLoading} sx={{ zIndex: 99 }}>
				<CircularProgress />
			</Backdrop>
		</>
	)
})
