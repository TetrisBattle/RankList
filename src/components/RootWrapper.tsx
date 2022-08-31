import { observer } from 'mobx-react-lite'
import { Backdrop, Box, CircularProgress } from '@mui/material'
import { useStoreContext } from 'stores/StoreContext'
import Header from 'components/Header'
import { ReactChildren } from 'interfaces/react'

const RootWrapper = ({ children }: ReactChildren) => {
	const { appStore } = useStoreContext()

	return (
		<Box
			sx={(theme) => ({
				bgcolor: theme.palette.background.default,
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				color: theme.palette.text.primary,
			})}
		>
			<Header />
			<Box>{children}</Box>

			<Backdrop open={appStore.isLoading}>
				<CircularProgress />
			</Backdrop>
		</Box>
	)
}

export default observer(RootWrapper)
