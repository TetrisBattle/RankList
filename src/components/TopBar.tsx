import { useCallback, useState } from 'react'
import {
	Box,
	Button,
	ListItemIcon,
	Menu,
	MenuItem,
	Typography,
	useTheme,
} from '@thng/react'
import SettingsIcon from '@mui/icons-material/Settings'
import { useStore } from 'hooks/useStore'
import LogoutIcon from '@mui/icons-material/Logout'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import { Page } from 'types'
import { SearchDialog } from './SearchDialog'
import { observer } from 'mobx-react-lite'

export const TopBar = observer(() => {
	const theme = useTheme()
	const { firebase, listStore, itemDialogStore } = useStore()
	const [seachDialogOpen, setSearchDialogOpen] = useState(false)
	const [listMenuAnchor, setListMenuAnchor] = useState<HTMLElement | null>(
		null
	)
	const [settingsMenuAnchor, setSettingsMenuAnchor] =
		useState<HTMLElement | null>(null)

	const pageButtonBgColor = useCallback(
		(page: Page) => {
			return listStore.selectedPageId === page.id
				? theme.palette.primary.main
				: theme.palette.background.default
		},
		[
			listStore.selectedPageId,
			theme.palette.primary.main,
			theme.palette.background.default,
		]
	)

	function PageButton(page: Page) {
		return (
			<Button
				onClick={() => listStore.setSelectedPageId(page.id)}
				sx={{
					borderRadius: 0,
					bgcolor: pageButtonBgColor(page),
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
				sx={{
					width: 1,
					maxWidth: theme.breakpoints.values.md,
					bgcolor: theme.palette.background.default,
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
								color: theme.palette.primary.light,
							},
						}}
					>
						<Typography
							sx={{
								px: 1,
								fontSize: 22,
								color: listMenuAnchor
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
								bgcolor: theme.palette.background.default,
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
})
