import { useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { useStoreContext } from 'stores/StoreContext'

const TopBar = () => {
	const { mangaStore, mangaDialogStore } = useStoreContext()
	const [x, render] = useState(false)

	const PageButton = ({ text }: { text: string }) => {
		return (
			<Button
				onClick={() => {
					mangaStore.activePage = 'rank' + text
					render(!x)
				}}
				sx={{
					borderRadius: 0,
					bgcolor: (theme) =>
						mangaStore.activePage === 'rank' + text
							? theme.palette.primary.main
							: theme.palette.background.default,
				}}
			>
				{text}
			</Button>
		)
	}

	return (
		<Box
			sx={{
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
				<Box
					sx={{
						display: 'flex',
						flex: 4,
						alignItems: 'center',
					}}
				>
					<Typography sx={{ pl: 1, fontSize: 22 }}>RankList</Typography>
				</Box>
				<Box sx={{ display: 'flex', flex: 3 }}>
					<PageButton text={'X'} />
					<PageButton text={'?'} />
					<Button
						color={'secondary'}
						onClick={() => {
							mangaDialogStore.dialogType = 'new'
							mangaDialogStore.openDialog = true
						}}
						sx={{
							borderRadius: 0,
							bgcolor: (theme) => theme.palette.secondary.main,
						}}
					>
						+
					</Button>
				</Box>
			</Box>
			<Box sx={{ display: 'flex', width: 1 }}>
				<PageButton text={'S'} />
				<PageButton text={'A'} />
				<PageButton text={'B'} />
				<PageButton text={'C'} />
				<PageButton text={'D'} />
				<PageButton text={'E'} />
				<PageButton text={'F'} />
			</Box>
		</Box>
	)
}

export default TopBar
