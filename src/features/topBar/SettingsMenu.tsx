import { Button, ListItemIcon, Menu, MenuItem } from '@thng/react'
import SettingsIcon from '@mui/icons-material/Settings'
import { useStore } from 'hooks/useStore'
import AddIcon from '@mui/icons-material/Add'
import HelpIcon from '@mui/icons-material/Help'
import LogoutIcon from '@mui/icons-material/Logout'
import { useState } from 'react'
import { Item } from 'models/Item'

export const SettingsMenu = () => {
	const [settingsMenuAnchor, setSettingsMenuAnchor] =
		useState<HTMLElement | null>(null)
	const { firebaseStore, appStore } = useStore()

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
						setSettingsMenuAnchor(null)
						const newItem = new Item()
						newItem.rank = appStore.selectedPage
						appStore.setSelectedItem(newItem)
						appStore.setItemDialogOpen(true)
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
						appStore.setStatusInfoDialogOpen(true)
					}}
				>
					<ListItemIcon>
						<HelpIcon fontSize='small' />
					</ListItemIcon>
					Info
				</MenuItem>
				<MenuItem
					onClick={() => {
						setSettingsMenuAnchor(null)
						firebaseStore.logout()
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
