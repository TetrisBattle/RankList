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
import { Logout as LogoutIcon, Add as AddIcon } from '@mui/icons-material'
import { Page } from 'stores/ListStore'

const TopBar = () => {
	const { firebaseStore, listStore, dialogStore } = useStoreContext()
	const [listMenuAnchor, setListMenuAnchor] = useState<HTMLElement | null>(null)
	const [settingsMenuAnchor, setSettingsMenuAnchor] =
		useState<HTMLElement | null>(null)

	useEffect(() => {}, [listStore.selectedPage])

	const PageButton = ({
		page,
	}: {
		page: { value: Page; displayName: string }
	}) => {
		return (
			<Button
				onClick={() => (listStore.selectedPage = page.value)}
				sx={{
					borderRadius: 0,
					bgcolor: (theme) =>
						listStore.selectedPage === page.value
							? theme.palette.primary.main
							: theme.palette.background.default,
				}}
			>
				{page.displayName}
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
						dialogStore.dialogType = 'new'
						dialogStore.openDialog()
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
						firebaseStore.logout()
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
					{listStore.pageOptions.extraPages.map((page) => (
						<PageButton key={page.value} page={page} />
					))}
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
				{listStore.pageOptions.rankPages.map((page) => (
					<PageButton key={page.value} page={page} />
				))}
			</Box>
		</Box>
	)
}

export default observer(TopBar)
