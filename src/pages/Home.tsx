import { observer } from 'mobx-react-lite'
import {
	Box,
	Button,
	Typography,
	List,
	ListItemText,
	Stack,
} from '@mui/material'
import { useStoreContext } from 'stores/StoreContext'
import { useState } from 'react'

const Home = () => {
	const { mangaStore } = useStoreContext()
	const [activePage, setActivePAge] = useState('S')

	const TopBar = () => {
		const PageButton = ({ text }: { text: string }) => {
			return (
				<Button
					onClick={() => setActivePAge(text)}
					sx={{
						borderRadius: 0,
						width: 1 / 7,
						minWidth: 'unset',
						p: 0,
						m: 0,
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

		return (
			<Box>
				<Box sx={{ display: 'flex' }}>
					<Typography sx={{ flex: 1, pl: 1, fontSize: 20 }}>
						RankList
					</Typography>
					<PageButton text={'X'} />
					<PageButton text={'?'} />
				</Box>
				<Box>
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

	const ListItem = () => {
		return (
			<Stack
				direction={'row'}
				gap={.5}
				sx={{
					width: 1,
					justifyContent: 'center',
					pt: 0,
					pb: 0.5,
					'& .MuiListItemText-root': {
						bgcolor: (theme) => theme.palette.secondary.main,
						mt: 0,
						paddingInline: 1,
					},
				}}
			>
				<ListItemText primary={1} sx={{ flex: 1, textAlign: 'center' }} />
				<ListItemText primary='Solo Leveling' sx={{ flex: 12 }} />
				<ListItemText primary={1234} sx={{ flex: 2, textAlign: 'center' }} />
			</Stack>
		)
	}

	return (
		<Box sx={{ maxWidth: 360, marginInline: 'auto' }}>
			<TopBar />
			<List sx={{ m: 0, p: 0 }}>
				<ListItem />
			</List>
		</Box>
	)
}

export default observer(Home)
