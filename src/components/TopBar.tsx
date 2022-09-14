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
	const [listMenuAnchor, setListMenuAnchor] = useState<HTMLElement | null>(null)
	const [settingsMenuAnchor, setSettingsMenuAnchor] =
		useState<HTMLElement | null>(null)

	useEffect(() => {}, [listStore.selectedPage])

	type PageLetter = 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'X' | '?'
	const PageButton = ({ text }: { text: PageLetter }) => {
		const page: Rank = `rank${text === '?' ? 'Unknown' : text}`
		return (
			<Button
				onClick={() => {
					listStore.selectedPage = page
				}}
				sx={{
					borderRadius: 0,
					bgcolor: (theme) =>
						listStore.selectedPage === page
							? theme.palette.primary.main
							: theme.palette.background.default,
				}}
			>
				{text}
			</Button>
		)
	}

	const ListMenu = () => {
		return (
			<Menu
				anchorEl={listMenuAnchor}
				open={!!listMenuAnchor}
				onClose={() => setListMenuAnchor(null)}
			>
				{listStore.listOptions.map((option, index) => (
					<MenuItem
						key={option}
						selected={index === listStore.selectedListIndex}
						onClick={() => {
							listStore.selectedListIndex = index
							setListMenuAnchor(null)
						}}
					>
						{option}
					</MenuItem>
				))}
			</Menu>
		)
	}

	const SettingsMenu = () => {
		return (
			<Menu
				anchorEl={settingsMenuAnchor}
				open={!!settingsMenuAnchor}
				onClose={() => setSettingsMenuAnchor(null)}
			>
				<MenuItem
					onClick={() => {
						listStore.dialogType = 'new'
						listStore.dialogOpen = true
						setSettingsMenuAnchor(null)
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
						setSettingsMenuAnchor(null)
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
					onClick={(e) => setListMenuAnchor(e.currentTarget)}
					sx={{
						flex: 4,
						display: 'flex',
						alignItems: 'center',
						':hover': {
							cursor: 'pointer',
							color: (theme) => theme.palette.primary.light,
						},
					}}
				>
					<Typography
						sx={{
							px: 1,
							fontSize: 22,
							color: (theme) =>
								listMenuAnchor ? theme.palette.primary.light : 'inherit',
						}}
					>
						{listStore.selectedList}
					</Typography>
				</Box>
				<ListMenu />
				<Box sx={{ display: 'flex', flex: 3 }}>
					<PageButton text={'X'} />
					<PageButton text={'?'} />
					<Button
						onClick={(e) => setSettingsMenuAnchor(e.currentTarget)}
						sx={{
							borderRadius: 0,
							bgcolor: (theme) => theme.palette.background.default,
						}}
					>
						<SettingsIcon fontSize='small' />
					</Button>
					<SettingsMenu />
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
