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
import LogoutIcon from '@mui/icons-material/Logout'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import { Page } from 'types'
import Firebase from 'gateway/Firebase'
import SearchDialog from './SearchDialog'

interface TopBarProps {
	topBarRef: React.MutableRefObject<HTMLElement | undefined>
}

function TopBar({ topBarRef }: TopBarProps) {
	const firebase = new Firebase()
	const { listStore, itemDialogStore } = useStoreContext()
	const [seachDialogOpen, setSearchDialogOpen] = useState(false)
	const [listMenuAnchor, setListMenuAnchor] = useState<HTMLElement | null>(
		null
	)
	const [settingsMenuAnchor, setSettingsMenuAnchor] =
		useState<HTMLElement | null>(null)

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	useEffect(() => {}, [listStore.selectedPageId])

	function PageButton(page: Page) {
		return (
			<Button
				onClick={() => listStore.setSelectedPageId(page.id)}
				sx={{
					borderRadius: 0,
					bgcolor: (theme) =>
						listStore.selectedPageId === page.id
							? theme.palette.primary.main
							: theme.palette.background.default,
				}}
			>
				{page.label}
			</Button>
		)
	}

	function ItemMenu() {
		return (
			<Menu
				anchorEl={listMenuAnchor}
				open={!!listMenuAnchor}
				onClose={() => setListMenuAnchor(null)}
			>
				{listStore.listOptions.map((option) => (
					<MenuItem
						key={option}
						selected={option === listStore.selectedList}
						onClick={() => {
							listStore.setSelectedList(option)
							setListMenuAnchor(null)
						}}
					>
						{option}
					</MenuItem>
				))}
			</Menu>
		)
	}

	function SettingsMenu() {
		return (
			<Menu
				anchorEl={settingsMenuAnchor}
				open={!!settingsMenuAnchor}
				onClose={() => setSettingsMenuAnchor(null)}
			>
				<MenuItem
					onClick={() => {
						itemDialogStore.setDialogType('new')
						itemDialogStore.setDialogOpen(true)
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
						setSearchDialogOpen(true)
						setSettingsMenuAnchor(null)
					}}
				>
					<ListItemIcon>
						<SearchIcon fontSize='small' />
					</ListItemIcon>
					Search
				</MenuItem>
				<MenuItem
					onClick={() => {
						firebase.logout()
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
		<>
			<Box
				ref={topBarRef}
				sx={{
					position: 'fixed',
					top: 0,
					width: 1,
					maxWidth: (theme) => theme.breakpoints.values.md,
					zIndex: 1,
					bgcolor: (theme) => theme.palette.background.default,
					pb: 0.5,
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
									listMenuAnchor
										? theme.palette.primary.light
										: 'inherit',
							}}
						>
							{listStore.selectedList}
						</Typography>
					</Box>
					<ItemMenu />
					<Box sx={{ display: 'flex', flex: 3 }}>
						{listStore.rankList.map((page) => {
							if (page.id.substring(0, 4) !== 'rank')
								return <PageButton key={page.id} {...page} />
							else return null
						})}
						<Button
							onClick={(e) =>
								setSettingsMenuAnchor(e.currentTarget)
							}
							sx={{
								borderRadius: 0,
								bgcolor: (theme) =>
									theme.palette.background.default,
							}}
						>
							<SettingsIcon fontSize='small' />
						</Button>
						<SettingsMenu />
					</Box>
				</Box>
				<Box sx={{ display: 'flex', width: 1 }}>
					{listStore.rankList.map((page) => {
						if (page.id.substring(0, 4) === 'rank')
							return <PageButton key={page.id} {...page} />
						else return null
					})}
				</Box>
			</Box>
			<SearchDialog
				open={seachDialogOpen}
				setOpen={setSearchDialogOpen}
			/>
		</>
	)
}

export default observer(TopBar)
