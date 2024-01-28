import { makeAutoObservable } from 'mobx'
import { AppStore } from 'stores/AppStore'
import { FirebaseStore, Table } from 'stores/FirebaseStore'
import { Item } from './Item'

export class ItemStore {
	items: Item[] = []

	constructor(
		private db: FirebaseStore,
		private appStore: AppStore
	) {
		makeAutoObservable(this)
	}

	setItems = (items: Item[]) => {
		this.items = items
	}

	fetch = async (table: Table) => {
		this.setItems(await this.db.getDatas(table))
	}

	add = async (item: Item) => {
		this.items.push(item)
		this.items.sort((a, b) => a.name.localeCompare(b.name))
		this.db.writeData(this.appStore.selectedList, item)
	}

	edit = async (item: Item) => {
		const index = this.items.findIndex((i) => i.id === item.id)
		if (index === -1) return

		const nameHasChanged = this.items[index].name === item.name
		this.items[index] = item
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
}
