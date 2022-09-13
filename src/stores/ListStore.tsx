import { makeAutoObservable } from 'mobx'
import {
	collection,
	getDocs,
	addDoc,
	setDoc,
	deleteDoc,
	doc,
	query,
	orderBy,
} from 'firebase/firestore'
import RootStore from './RootStore'
import UserStore from './UserStore'

export class Item {
	constructor(public id = '', public name = '', public progress = '') {
		makeAutoObservable(this)
	}
}

export default class ListStore {
	private _items: Item[] = []
	private _isLoading = false
	private _activePage = 'rankS'
	private _userStore: UserStore

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

	get activePage() {
		return this._activePage
	}

	set activePage(value: string) {
		this._activePage = value
	}

	get items() {
		return this._items
	}

	private set items(value: Item[]) {
		this._items = value
	}

	async updateList() {
		if (!this._userStore.dbPath) {
			this.items = []
			return
		}

		this.items = []
		this.isLoading = true
		const items: Item[] = []

		const ref = collection(
			this._userStore.db,
			`${this._userStore.dbPath}/${this._activePage}`
		)
		const q = query(ref, orderBy('name', 'asc'))
		const snapshot = await getDocs(q)

		snapshot.docs.forEach((doc) => {
			items.push(new Item(doc.id, doc.data().name, doc.data().chapter))
		})

		this.items = items
		this.isLoading = false
	}

	async saveNewItem(name: string, chapter: string) {
		if (!this._userStore.dbPath) return

		const ref = collection(
			this._userStore.db,
			`${this._userStore.dbPath}/${this._activePage}`
		)
		await addDoc(ref, {
			name: name,
			chapter: chapter,
		})
		this.updateList()
	}

	async edit(name: string, chapter: string) {
		if (!this._userStore.dbPath) return

		const ref = doc(
			this._userStore.db,
			`${this._userStore.dbPath}/${this._activePage}`,
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
		if (!this._userStore.dbPath) return

		const ref = doc(
			this._userStore.db,
			`${this._userStore.dbPath}/${this._activePage}`,
			name
		)
		await deleteDoc(ref)
		this.items = this.items.filter((item) => item.name !== name)
	}
}
