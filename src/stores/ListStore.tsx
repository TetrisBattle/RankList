import { makeAutoObservable, toJS } from 'mobx'
import {
	doc,
	DocumentReference,
	DocumentData,
	getFirestore,
	setDoc,
} from 'firebase/firestore'
import firebaseApp from 'firebaseApp'
import { User } from 'firebase/auth'

export class Item {
	constructor(public name = '', public progress = '') {
		makeAutoObservable(this)
	}
}

interface RankList {
	rankS?: Item[]
	rankA?: Item[]
	rankB?: Item[]
	rankC?: Item[]
	rankD?: Item[]
	rankE?: Item[]
	rankF?: Item[]
	rankX?: Item[]
	rankUnknown?: Item[]
}

export type Rank =
	| 'rankS'
	| 'rankA'
	| 'rankB'
	| 'rankC'
	| 'rankD'
	| 'rankE'
	| 'rankF'
	| 'rankX'
	| 'rankUnknown'

export default class ListStore {
	private _isLoading = false
	private _openDialog = false
	private _dialogType = 'new'

	private _currentList = 'mangaList'
	private _currentPage: Rank = 'rankS'

	private _rankList: RankList = {}
	private _items: Item[] = []
	private _editableItems: Item[] = []
	private _editableItem = new Item()
	private _editableItemIndex = 0

	private _db = getFirestore(firebaseApp)
	private _listRef: DocumentReference<DocumentData> | null = null

	constructor() {
		makeAutoObservable(this)
	}

	get isLoading() {
		return this._isLoading
	}

	set isLoading(value) {
		this._isLoading = value
	}

	get openDialog() {
		return this._openDialog
	}

	set openDialog(value) {
		this._openDialog = value
		if (!this._openDialog) {
			this.editableItem.name = ''
			this.editableItem.progress = ''
		}
	}

	get dialogType() {
		return this._dialogType
	}

	set dialogType(value) {
		this._dialogType = value
	}

	get items() {
		return toJS(this._items)
	}

	get currentList() {
		return this._currentList
	}

	get currentPage() {
		return this._currentPage
	}

	set currentPage(value: Rank) {
		this._currentPage = value
		this._items = this._rankList[this._currentPage] ?? []
	}

	get listRef() {
		return this._listRef
	}

	get editableItem() {
		return this._editableItem
	}

	set editableItem(value) {
		this._editableItem = value
	}

	set editableItemName(value: string) {
		this._editableItem.name = value
	}

	set editableItemProgress(value: string) {
		this._editableItem.progress = value
	}

	get editableItemIndex() {
		return this._editableItemIndex
	}

	set editableItemIndex(value) {
		this._editableItemIndex = value
	}

	setupRef(user: User | null) {
		if (!user) {
			this._listRef = null
			return
		}

		this._listRef = doc(
			this._db,
			`users/${user.email}/lists/${this._currentList}`
		)
	}

	setupItems(data: RankList | undefined) {
		if (!data) {
			this._rankList = {}
			this._items = []
			this._editableItems = []
			return
		}

		this._rankList = data
		this._items = this._rankList[this.currentPage] ?? []
		this._editableItems = this._rankList[this.currentPage] ?? []
	}

	async addNewItem() {
		if (!this._listRef) return

		this._editableItems.push({
			name: this.editableItem.name,
			progress: this.editableItem.progress,
		})

		await setDoc(this._listRef, { [this._currentPage]: this._editableItems })
	}

	async edit() {
		if (!this._listRef) return
		this._editableItems[this._editableItemIndex] = this._editableItem
		await setDoc(this._listRef, { [this._currentPage]: this._editableItems })
	}

	async delete() {
		if (!this._listRef) return
		this._editableItems.splice(this._editableItemIndex, 1)
		await setDoc(this._listRef, { [this._currentPage]: this._editableItems })
	}
}
