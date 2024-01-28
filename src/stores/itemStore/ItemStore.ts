import { makeAutoObservable } from 'mobx'
import { AppStore } from 'stores/AppStore'
import { FirebaseStore } from 'stores/FirebaseStore'
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

	add = async (item: Item) => {
		this.items.push(item)
		this.db.writeData(this.appStore.selectedList, item)
	}

	edit = async (item: Item) => {
		const index = this.items.findIndex((i) => i.id === item.id)
		if (index === -1) return
		this.items[index] = item
		this.db.writeData(this.appStore.selectedList, item)
	}

	delete = async (itemId: string) => {
		const index = this.items.findIndex((i) => i.id === itemId)
		if (index === -1) return
		this.items.splice(index, 1)
		this.db.deleteData(this.appStore.selectedList, itemId)
	}
}
