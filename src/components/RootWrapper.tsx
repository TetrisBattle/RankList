import { observer } from 'mobx-react-lite'
import { Backdrop, Box, CircularProgress } from '@mui/material'
import { useStoreContext } from 'stores/StoreContext'
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
			{children}
			<Backdrop open={appStore.isLoading}>
				<CircularProgress />
			</Backdrop>
		</Box>
	)
}

export default observer(RootWrapper)
