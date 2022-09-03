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

	const ListItem = ({
		counter,
		name,
		chapter,
	}: {
		counter: number
		name: string
		chapter: string
	}) => {
		return (
			<Stack
				direction={'row'}
				gap={0.5}
				sx={{
					width: 1,
					justifyContent: 'center',
					'& .MuiListItemText-root': {
						bgcolor: (theme) => theme.palette.secondary.main,
						mt: 0,
					},
				}}
			>
				<ListItemText primary={counter} sx={{ flex: 1, textAlign: 'center' }} />
				<ListItemText primary={name} sx={{ flex: 8, pl: 1 }} />
				<ListItemText primary={chapter} sx={{ flex: 2, textAlign: 'center' }} />
			</Stack>
		)
	}

	return (
		<Box sx={{ maxWidth: 1200, marginInline: 'auto' }}>
			<TopBar />
			<List
				sx={{ m: 0, p: 0, '& .MuiListItemText-root': { paddingBlock: 0.5 } }}
			>
				<ListItem counter={1} name={'Solo Leveling'} chapter={'1234'} />
				<ListItem
					counter={2}
					name={'The Beginning After The End'}
					chapter={'64'}
				/>
			</List>
		</Box>
	)
}

export default observer(Home)
