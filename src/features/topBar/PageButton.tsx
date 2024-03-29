import { Button, observer, useTheme } from '@thng/react'
import { useStore } from 'hooks/useStore'
import { Rank } from 'stores/FirebaseStore'

export const PageButton = observer(({ page }: { page: Rank }) => {
	const theme = useTheme()
	const { appStore } = useStore()

	return (
		<Button
			onClick={() => appStore.setSelectedPage(page)}
			sx={{
				borderRadius: 0,
				bgcolor:
					appStore.selectedPage === page
						? theme.palette.primary.main
						: theme.palette.background.default,
			}}
		>
			{page}
		</Button>
	)
})
