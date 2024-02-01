import { makeAutoObservable, runInAction } from '@thng/react'
import { AppStore } from 'stores/AppStore'
import { FirebaseStore, Table } from 'stores/FirebaseStore'
import { Item } from './Item'

export class ItemStore {
	dialogOpen = false
	items: Item[] = []
	selectedItem = new Item()
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

	private sortItems = () => {
		this.items.sort((a, b) => a.name.localeCompare(b.name))
	}

	fetch = async (table: Table) => {
		this.setItems(await this.db.getUserData(table))
	}

	add = async (item: Item) => {
		const savedItem = await this.db.post(this.appStore.selectedList, item)

		runInAction(() => {
			this.items.push(savedItem)
		})

		this.sortItems()
	}

	edit = async (item: Item) => {
		const itemIndex = this.items.findIndex((i) => i.id === item.id)
		if (itemIndex === -1) throw new Error('Item not found')

		const nameHasChanged =
			this.items[itemIndex].name.toLowerCase() !== item.name.toLowerCase()

		await this.db.put(this.appStore.selectedList, item)

		runInAction(() => {
			this.items[itemIndex] = item
		})

		if (nameHasChanged) this.sortItems()
	}

	delete = async (itemId: string) => {
		const itemIndex = this.items.findIndex((i) => i.id === itemId)
		if (itemIndex === -1) throw new Error('Item not found')
		this.items.splice(itemIndex, 1)
		this.db.delete(this.appStore.selectedList, itemId)
	}
}
