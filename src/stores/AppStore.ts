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

	private get listItems() {
		return this.items[this.selectedList]
	}

	get sortedListItems() {
		return this.listItems.toSorted((a, b) => a.name.localeCompare(b.name))
	}

	setDialogOpen = (open: boolean) => {
		this.dialogOpen = open
	}

	setSelectedList = async (table: Table) => {
		this.selectedList = table

		if (this.listItems.length === 0) {
			await this.fetchListItems()
		}
	}

	setSelectedPage = (rank: Rank) => {
		this.selectedPage = rank
	}

	setSelectedItem = (item: Item) => {
		this.selectedItem = item
	}

	setDisplayProgress = (display: boolean) => {
		this.displayProgress = display
	}

	reset = () => {
		this.dialogOpen = false
		this.items = {
			mangas: [],
			movies: [],
			series: [],
		}
		this.selectedList = 'mangas'
		this.selectedPage = 'S'
		this.selectedItem = new Item()
		this.displayProgress = true
	}

	fetchListItems = async () => {
		const listItems = await this.db.getUserData(this.selectedList)
		this.items[this.selectedList] = listItems
	}

	add = async (item: Item) => {
		const savedItem = await this.db.post(this.selectedList, item)

		runInAction(() => {
			this.listItems.push(savedItem)
		})
	}

	edit = async (item: Item) => {
		const itemIndex = this.listItems.findIndex((i) => i.id === item.id)
		if (itemIndex === -1) throw new Error('Item not found')

		await this.db.put(this.selectedList, item)

		runInAction(() => {
			this.listItems[itemIndex] = item
		})
	}

	delete = async (itemId: string) => {
		const itemIndex = this.listItems.findIndex((i) => i.id === itemId)
		if (itemIndex === -1) throw new Error('Item not found')
		this.listItems.splice(itemIndex, 1)
		this.db.delete(this.selectedList, itemId)
	}
}
