import { useState } from 'react'
import { Box, Button, Typography } from '@mui/material'

const PageButton = ({ text }: { text: string }) => {
	const [activePage, setActivePAge] = useState('S')

	return (
		<Button
			onClick={() => setActivePAge(text)}
			sx={{
				flex: 1,
				minWidth: 30,
				fontSize: 20,
				fontWeight: 600,
				p: 0.25,
				bgcolor: (theme) =>
					activePage === text
						? theme.palette.primary.main
						: theme.palette.background.default,
			}}
		>
			{text}
		</Button>
	)
}

const TopBar = () => {
	return (
		<Box>
			<Box sx={{ display: 'flex' }}>
				<Box
					sx={{
						display: 'flex',
						flex: 4,
						alignItems: 'center',
					}}
				>
					<Typography
						sx={{
							pl: 1,
							fontSize: 22,
						}}
					>
						RankList
					</Typography>
				</Box>
				<Box sx={{ display: 'flex', flex: 3 }}>
					<PageButton text={'X'} />
					<PageButton text={'?'} />
					<PageButton text={'+'} />
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
