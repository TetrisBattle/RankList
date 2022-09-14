import { useEffect, useState } from 'react'
import {
	Box,
	Button,
	ListItemIcon,
	Menu,
	MenuItem,
	Typography,
} from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import { useStoreContext } from 'stores/StoreContext'
import { observer } from 'mobx-react-lite'
import { Rank } from 'stores/ListStore'
import { Logout as LogoutIcon, Add as AddIcon } from '@mui/icons-material'

const TopBar = () => {
	const { authStore, listStore } = useStoreContext()
	const [settingsMenu, setSettingsMenu] = useState<HTMLElement | null>(null)

	useEffect(() => {}, [listStore.currentPage])

	type PageLetter = 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'X' | '?'
	const PageButton = ({ text }: { text: PageLetter }) => {
		const page: Rank = `rank${text === '?' ? 'Unknown' : text}`

		return (
			<Button
				onClick={() => {
					listStore.currentPage = page
				}}
				sx={{
					borderRadius: 0,
					bgcolor: (theme) =>
						listStore.currentPage === page
							? theme.palette.primary.main
							: theme.palette.background.default,
				}}
			>
				{text}
			</Button>
		)
	}

	const ItemMenu = () => {
		return (
			<Menu
				anchorEl={settingsMenu}
				open={!!settingsMenu}
				onClose={() => setSettingsMenu(null)}
			>
				<MenuItem
					onClick={() => {
						listStore.dialogType = 'new'
						listStore.dialogOpen = true
						setSettingsMenu(null)
					}}
				>
					<ListItemIcon>
						<AddIcon fontSize='small' />
					</ListItemIcon>
					Add new
				</MenuItem>
				<MenuItem
					onClick={() => {
						authStore.logout()
						setSettingsMenu(null)
					}}
				>
					<ListItemIcon>
						<LogoutIcon fontSize='small' />
					</ListItemIcon>
					Logout
				</MenuItem>
			</Menu>
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
					<Typography sx={{ pl: 1, fontSize: 22 }}>
						{listStore.currentList.charAt(0).toUpperCase() +
							listStore.currentList.slice(1)}
					</Typography>
				</Box>
				<Box sx={{ display: 'flex', flex: 3 }}>
					<PageButton text={'X'} />
					<PageButton text={'?'} />
					<Button
						onClick={(e) => {
							setSettingsMenu(e.currentTarget)
						}}
						sx={{
							borderRadius: 0,
							bgcolor: (theme) => theme.palette.background.default,
						}}
					>
						<SettingsIcon fontSize='small' />
					</Button>
					<ItemMenu />
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

export default observer(TopBar)
