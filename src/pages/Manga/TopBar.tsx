import { useState } from 'react'
import { Box, Button, ButtonProps, Typography } from '@mui/material'
import NewMangaDialog from './NewMangaDialog'
import { useStoreContext } from 'stores/StoreContext'

const TopBar = () => {
	const [open, setOpen] = useState(false)
	const { mangaStore } = useStoreContext()
	const [x, render] = useState(false)

	const PageButton = ({
		text,
		baseProps,
	}: {
		text: string
		baseProps?: ButtonProps
	}) => {
		return (
			<Button
				onClick={
					baseProps?.onClick
						? baseProps.onClick
						: () => {
								mangaStore.activePage = 'rank' + text
								render(!x)
						  }
				}
				sx={{
					borderRadius: 0,
					bgcolor: (theme) =>
						mangaStore.activePage === 'rank' + text
							? theme.palette.primary.main
							: theme.palette.background.default,
				}}
				{...baseProps}
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
					<PageButton
						text={'+'}
						baseProps={{
							color: 'secondary',
							onClick: () => setOpen(true),
							sx: {
								bgcolor: (theme) => theme.palette.secondary.main,
							},
						}}
					/>
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

			<NewMangaDialog open={open} setOpen={setOpen} />
		</Box>
	)
}

export default TopBar
