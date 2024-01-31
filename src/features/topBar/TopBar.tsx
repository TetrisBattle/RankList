import { Box } from '@thng/react'
import { PageButton } from './PageButton'
import { SettingsMenu } from './SettingsMenu'
import { ListMenu } from './ListMenu'
import { rankOptions } from 'stores/FirebaseStore'

export const TopBar = () => {
	return (
		<>
			<Box
				sx={{
					width: 1,
					maxWidth: (theme) => theme.breakpoints.values.md,
					bgcolor: (theme) => theme.palette.background.default,
					pb: 0.5,
					'& .MuiButton-root': {
						flex: 1,
						minWidth: 30,
						fontSize: 20,
						fontWeight: 600,
						p: 0.25,
					},
				}}
			>
				<Box sx={{ display: 'flex' }}>
					<ListMenu />
					<Box sx={{ display: 'flex', flex: 3 }}>
						{rankOptions.slice(7).map((page) => {
							return <PageButton key={page} page={page} />
						})}
						<SettingsMenu />
					</Box>
				</Box>
				<Box sx={{ display: 'flex', width: 1 }}>
					{rankOptions.slice(0, 7).map((page) => {
						return <PageButton key={page} page={page} />
					})}
				</Box>
			</Box>
		</>
	)
}
