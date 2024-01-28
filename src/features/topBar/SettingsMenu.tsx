import { Button, ListItemIcon, Menu, MenuItem } from '@thng/react'
import SettingsIcon from '@mui/icons-material/Settings'
import { useStore } from 'hooks/useStore'
import LogoutIcon from '@mui/icons-material/Logout'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import { useState } from 'react'

export const SettingsMenu = () => {
	const [settingsMenuAnchor, setSettingsMenuAnchor] =
		useState<HTMLElement | null>(null)
	const { firebaseStore, itemDialogStore } = useStore()

	return (
		<>
			<Button
				onClick={(e) => setSettingsMenuAnchor(e.currentTarget)}
				sx={{
					borderRadius: 0,
					bgcolor: (theme) => theme.palette.background.default,
				}}
			>
				<SettingsIcon fontSize='small' />
			</Button>
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
		</>
	)
}
