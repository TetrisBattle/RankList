import { makeAutoObservable } from '@thng/react'
import { AppStore } from 'stores/AppStore'
import { FirebaseStore, Table } from 'stores/FirebaseStore'
import { Item } from './Item'
import { ItemForm } from 'features/itemDialog/itemValidation'

export class ItemStore {
	dialogOpen = false
	items: Item[] = []
	selectedItem: Item = new Item()
	displayProgress = true

	constructor(
		private db: FirebaseStore,
		private appStore: AppStore
	) {
		makeAutoObservable(this)
	}

	setDialogOpen = (open: boolean) => {
		this.dialogOpen = open
	}

	setItems = (items: Item[]) => {
		this.items = items
	}

	setSelectedItem = (item: Item) => {
		this.selectedItem = item
	}

	setDisplayProgress = (display: boolean) => {
		this.displayProgress = display
	}

	fetch = async (table: Table) => {
		this.setItems(await this.db.getDatas(table))
	}

	private add = async (item: Item) => {
		this.items.push(item)
		this.items.sort((a, b) => a.name.localeCompare(b.name))
		this.db.writeData(this.appStore.selectedList, item)
	}

	private edit = async (item: Item) => {
		const itemIndex = this.items.findIndex((i) => i.id === item.id)
		if (itemIndex === -1) return

		const nameHasChanged =
			this.items[itemIndex].name.toLowerCase() === item.name.toLowerCase()

		this.items[itemIndex] = item

		if (nameHasChanged) {
			this.items.sort((a, b) => a.name.localeCompare(b.name))
		}

		this.db.writeData(this.appStore.selectedList, item)
	}

	delete = async (itemId: string) => {
		const index = this.items.findIndex((i) => i.id === itemId)
		if (index === -1) return
		this.items.splice(index, 1)
		this.db.deleteData(this.appStore.selectedList, itemId)
	}

	save = async (item: ItemForm) => {
		this.selectedItem.name = item.name.trim()
		this.selectedItem.progress = item.progress.trim()
		this.selectedItem.rank = item.rank

		console.log('Saved')
	}
}
