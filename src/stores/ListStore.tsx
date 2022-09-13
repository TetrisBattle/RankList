import { makeAutoObservable } from 'mobx'
import {
	collection,
	addDoc,
	setDoc,
	deleteDoc,
	doc,
} from 'firebase/firestore'
import RootStore from './RootStore'
import UserStore from './UserStore'

export class Item {
	constructor(public id = '', public name = '', public progress = '') {
		makeAutoObservable(this)
	}
}

export default class ListStore {
	private _userStore: UserStore
	private _items: Item[] = []
	private _isLoading = false
	private _currentList = 'mangaList'
	private _currentRank = 'rankS'

	constructor(rootStore: RootStore) {
		this._userStore = rootStore.userStore
		makeAutoObservable(this)
	}

	get isLoading() {
		return this._isLoading
	}

	set isLoading(value: boolean) {
		this._isLoading = value
	}

	get currentList() {
		return this._currentList
	}

	set currentList(value: string) {
		this._currentList = value
	}

	get currentRank() {
		return this._currentRank
	}

	set currentRank(value: string) {
		this._currentRank = value
	}

	get items() {
		return this._items
	}

	set items(value: Item[]) {
		this._items = value
	}

	async saveNewItem(name: string, chapter: string) {
		const ref = collection(
			this._userStore.db,
			`${this._userStore.dbPath}/${this._currentRank}`
		)
		await addDoc(ref, {
			name: name,
			chapter: chapter,
		})
	}

	async edit(name: string, chapter: string) {
		const ref = doc(
			this._userStore.db,
			`${this._userStore.dbPath}/${this._currentRank}`,
			name
		)
		await setDoc(ref, {
			name: name,
			chapter: chapter,
		})

		const index = this.items.findIndex((item) => item.name === name)
		const copy = JSON.parse(JSON.stringify(this.items))
		copy[index].name = name
		copy[index].chapter = chapter
		copy.sort((a: Item, b: Item) => {
			if (a.name.toUpperCase() > b.name.toUpperCase()) return 1
			else return -1
		})
		this.items = copy
	}

	async delete(name: string) {
		const ref = doc(
			this._userStore.db,
			`${this._userStore.dbPath}/${this._currentRank}`,
			name
		)
		await deleteDoc(ref)
		this.items = this.items.filter((item) => item.name !== name)
	}
}
