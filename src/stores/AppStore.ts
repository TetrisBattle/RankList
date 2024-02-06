import { makeAutoObservable, runInAction } from '@thng/react'
import { FirebaseStore, Rank, Table } from 'stores/FirebaseStore'
import { Item } from '../models/Item'

export class AppStore {
	dialogOpen = false
	private items: {
		[key in Table]: Item[]
	} = {
		mangas: [],
		movies: [],
		series: [],
	}
	selectedList: Table = 'mangas'
	selectedPage: Rank = 'S'
	selectedItem = new Item()
	displayProgress = true

	constructor(private db: FirebaseStore) {
		makeAutoObservable(this)
	}

	setDialogOpen = (open: boolean) => {
		this.dialogOpen = open
	}

	get listItmes() {
		return this.items[this.selectedList]
	}

	setListItems = (items: Item[]) => {
		this.items[this.selectedList] = items
	}

	setSelectedList(table: Table) {
		this.selectedList = table
	}

	setSelectedPage(rank: Rank) {
		this.selectedPage = rank
	}

	setSelectedItem = (item: Item) => {
		this.selectedItem = item
	}

	setDisplayProgress = (display: boolean) => {
		this.displayProgress = display
	}

	private sortListItems = () => {
		this.listItmes.sort((a, b) => a.name.localeCompare(b.name))
	}

	fetch = async (table: Table) => {
		const listItems = await this.db.getUserData(table)
		this.setListItems(listItems)
	}

	add = async (item: Item) => {
		const savedItem = await this.db.post(this.selectedList, item)

		runInAction(() => {
			this.listItmes.push(savedItem)
		})

		this.sortListItems()
	}

	edit = async (item: Item) => {
		const itemIndex = this.listItmes.findIndex((i) => i.id === item.id)
		if (itemIndex === -1) throw new Error('Item not found')

		const nameHasChanged =
			this.listItmes[itemIndex].name.toLowerCase() !==
			item.name.toLowerCase()

		await this.db.put(this.selectedList, item)

		runInAction(() => {
			this.listItmes[itemIndex] = item
		})

		if (nameHasChanged) this.sortListItems()
	}

	delete = async (itemId: string) => {
		const itemIndex = this.listItmes.findIndex((i) => i.id === itemId)
		if (itemIndex === -1) throw new Error('Item not found')
		this.listItmes.splice(itemIndex, 1)
		this.db.delete(this.selectedList, itemId)
	}
}
