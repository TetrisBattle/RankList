import { makeAutoObservable } from 'mobx'
import firebaseApp from 'firebaseApp'
import {
	getFirestore,
	collection,
	getDocs,
	addDoc,
	setDoc,
	deleteDoc,
	doc,
	query,
	orderBy,
} from 'firebase/firestore'

export class Item {
	constructor(public id = '', public name = '', public progress = '') {
		makeAutoObservable(this)
	}
}

export default class ListStore {
	private _items: Item[] = []
	private _isLoading = false
	private _activePage = 'rankS'
	private _db = getFirestore(firebaseApp)
	private _dbPath: string | null = null

	constructor() {
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

	get dbPath() {
		return this._dbPath
	}

	set dbPath(value: string | null) {
		this._dbPath = value
	}

	async updateList() {
		if (!this._dbPath) {
			this.items = []
			return
		}

		this.items = []
		this.isLoading = true
		const items: Item[] = []

		const ref = collection(this._db, `${this._dbPath}/${this._activePage}`)
		const q = query(ref, orderBy('name', 'asc'))
		const snapshot = await getDocs(q)

		snapshot.docs.forEach((doc) => {
			items.push(new Item(doc.id, doc.data().name, doc.data().chapter))
		})

		this.items = items
		this.isLoading = false
	}

	async saveNewItem(name: string, chapter: string) {
		if (!this._dbPath) return

		const ref = collection(this._db, `${this._dbPath}/${this._activePage}`)
		await addDoc(ref, {
			name: name,
			chapter: chapter,
		})
		this.updateList()
	}

	async edit(name: string, chapter: string) {
		if (!this._dbPath) return

		const ref = doc(this._db, `${this._dbPath}/${this._activePage}`, name)
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
		if (!this._dbPath) return

		const ref = doc(this._db, `${this._dbPath}/${this._activePage}`, name)
		await deleteDoc(ref)
		this.items = this.items.filter((item) => item.name !== name)
	}
}
