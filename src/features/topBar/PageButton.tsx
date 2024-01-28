import { Button, useTheme } from '@thng/react'
import { useStore } from 'hooks/useStore'
import { observer } from 'mobx-react-lite'
import { Rank } from 'stores/FirebaseStore'

export const PageButton = observer(({ page }: { page: Rank }) => {
	const theme = useTheme()
	const { appStore } = useStore()

	const getLabel = () => {
		switch (page) {
			case 'S':
				return 'S'
			case 'A':
				return 'A'
			case 'B':
				return 'B'
			case 'C':
				return 'C'
			case 'D':
				return 'D'
			case 'E':
				return 'E'
			case 'F':
				return 'F'
			case 'X':
				return 'X'
			case 'unknown':
				return '?'
		}
	}

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
			{getLabel()}
		</Button>
	)
})
