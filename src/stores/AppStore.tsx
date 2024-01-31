import { makeAutoObservable } from '@thng/react'
import { Rank, Table } from './FirebaseStore'

export class AppStore {
	selectedList: Table = 'mangas'
	selectedPage: Rank = 'S'

	constructor() {
		makeAutoObservable(this)
	}

	setSelectedList(table: Table) {
		this.selectedList = table
	}

	setSelectedPage(rank: Rank) {
		this.selectedPage = rank
	}
}
