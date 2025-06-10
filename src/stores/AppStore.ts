import { makeAutoObservable, runInAction } from '@thng/react'
import { FirebaseStore, Rank, Table } from 'stores/FirebaseStore'
import { Item } from '../models/Item'
import dayjs from 'dayjs'

export class AppStore {
	itemDialogOpen = false
	statusInfoDialogOpen = false
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

	private secretCode: Rank[] = ['S', 'B', 'D', 'F', 'A', 'C', 'E']
	private currentCode: Rank[] = []

	constructor(private db: FirebaseStore) {
		makeAutoObservable(this)

		this.currentCode.push(this.selectedPage)
	}

	private get listItems() {
		return this.items[this.selectedList]
	}

	get sortedListItems() {
		return this.listItems.toSorted((a, b) => a.name.localeCompare(b.name))
	}

	get isSecretCode(): boolean {
		if (this.currentCode.length === this.secretCode.length) {
			return this.currentCode.every(
				(code, index) => code === this.secretCode[index]
			)
		} else return false
	}

	setItemDialogOpen = (open: boolean) => {
		this.itemDialogOpen = open
	}

	setStatusInfoDialogOpen = (open: boolean) => {
		this.statusInfoDialogOpen = open
	}

	setSelectedList = async (table: Table) => {
		this.selectedList = table

		if (this.listItems.length === 0) {
			await this.fetchListItems()
		}
	}

	setSelectedPage = (rank: Rank) => {
		this.selectedPage = rank

		if (this.currentCode.length < this.secretCode.length) {
			this.currentCode.push(rank)
		} else {
			this.currentCode.shift()
			this.currentCode.push(rank)
		}

		if (this.isSecretCode) this.selectedPage = 'Z'
	}

	setSelectedItem = (item: Item) => {
		this.selectedItem = item
	}

	setDisplayProgress = (display: boolean) => {
		this.displayProgress = display
	}

	reset = () => {
		this.itemDialogOpen = false
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

		runInAction(() => {
			this.items[this.selectedList] = listItems
		})
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

	getStatus = (date: Date) => {
		const monthDiff = Math.abs(dayjs(date).diff(new Date(), 'month'))
		return monthDiff >= 12
			? 'hsl(0, 100%, 40%)'
			: monthDiff >= 6
				? 'hsl(35, 100%, 45%)'
				: monthDiff >= 3
					? 'hsl(50, 100%, 45%)'
					: 'hsl(100, 100%, 40%)'
	}
}
