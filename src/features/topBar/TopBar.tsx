import { Box } from '@thng/react'
import { PageButton } from './PageButton'
import { SettingsMenu } from './SettingsMenu'
import { ListMenu } from './ListMenu'
import { Rank } from 'stores/FirebaseStore'

export const TopBar = () => {
	const pageOptions: Rank[] = ['S', 'A', 'B', 'C', 'D', 'E', 'F']

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
						<PageButton page={'X'} />
						<PageButton page={'unknown'} />
						<SettingsMenu />
					</Box>
				</Box>
				<Box sx={{ display: 'flex', width: 1 }}>
					{pageOptions.map((page) => {
						return <PageButton key={page} page={page} />
					})}
				</Box>
			</Box>
		</>
	)
}
