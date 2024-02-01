import { makeAutoObservable, runInAction } from '@thng/react'
import { FirebaseStore, Rank, Table } from 'stores/FirebaseStore'
import { Item } from '../models/Item'

export class AppStore {
	dialogOpen = false
	selectedList: Table = 'mangas'
	selectedPage: Rank = 'S'
	items: Item[] = []
	selectedItem = new Item()
	displayProgress = true

	constructor(private db: FirebaseStore) {
		makeAutoObservable(this)
	}

	setDialogOpen = (open: boolean) => {
		this.dialogOpen = open
	}

	setSelectedList(table: Table) {
		this.selectedList = table
	}

	setSelectedPage(rank: Rank) {
		this.selectedPage = rank
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
		const savedItem = await this.db.post(this.selectedList, item)

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

		await this.db.put(this.selectedList, item)

		runInAction(() => {
			this.items[itemIndex] = item
		})

		if (nameHasChanged) this.sortItems()
	}

	delete = async (itemId: string) => {
		const itemIndex = this.items.findIndex((i) => i.id === itemId)
		if (itemIndex === -1) throw new Error('Item not found')
		this.items.splice(itemIndex, 1)
		this.db.delete(this.selectedList, itemId)
	}
}
