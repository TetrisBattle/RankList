import { makeAutoObservable, toJS } from 'mobx'
import {
	doc,
	DocumentReference,
	DocumentData,
	getFirestore,
	setDoc,
} from 'firebase/firestore'
import firebaseApp from 'firebaseApp'
import AuthStore from './AuthStore'

export class Item {
	constructor(public name = '', public progress = '') {
		makeAutoObservable(this)
	}
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

export default class ListStore {
	private _isLoading = false
	private _db = getFirestore(firebaseApp)
	private _listRef: DocumentReference<DocumentData> | null = null

	private _dialogItem = new Item()
	private _dialogOpen = false
	private _dialogType = 'new'
	private _dialogErrorText: string | null = null

	private _rankList: RankList = {}
	private _editableItems: Item[] = []
	private _editableItemIndex = 0

	private _listOptions = ['MangaList', 'Series', 'Movies']
	private _selectedListIndex = 0
	private _selectedPage: Rank = 'rankS'

	constructor(private _authStore: AuthStore) {
		makeAutoObservable(this)
	}

	get isLoading() {
		return this._isLoading
	}

	set isLoading(value) {
		this._isLoading = value
	}

	get listRef() {
		return this._listRef
	}

	get dialogItem() {
		return this._dialogItem
	}

	set dialogItem(value: Item) {
		this._dialogItem = value
	}

	set dialogItemName(value: string) {
		this._dialogItem.name = value
	}

	set dialogItemProgress(value: string) {
		this._dialogItem.progress = value
	}

	get dialogOpen() {
		return this._dialogOpen
	}

	set dialogOpen(value) {
		this._dialogOpen = value
		if (!this._dialogOpen) {
			this.dialogItem.name = ''
			this.dialogItem.progress = ''
		}
	}

	get dialogType() {
		return this._dialogType
	}

	set dialogType(value) {
		this._dialogType = value
	}

	get dialogErrorText() {
		return this._dialogErrorText
	}

	get items() {
		return toJS(this._rankList[this.selectedPage]) ?? []
	}

	get listOptions() {
		return this._listOptions
	}

	get selectedListIndex() {
		return this._selectedListIndex
	}

	set selectedListIndex(value) {
		this._selectedListIndex = value
		this.setListRef()
	}

	get selectedList() {
		return this._listOptions[this._selectedListIndex]
	}

	get selectedPage() {
		return this._selectedPage
	}

	set selectedPage(value) {
		this._selectedPage = value
		this._editableItems = this.items
	}

	get editableItemIndex() {
		return this._editableItemIndex
	}

	set editableItemIndex(value) {
		this._editableItemIndex = value
	}

	setupRef() {
		if (this._authStore.user) {
			this.setListRef()
		} else {
			this._listRef = null
		}
	}

	setupItems(data: RankList | undefined) {
		if (!data) {
			this._rankList = {}
			this._editableItems = []
			return
		}

		this._rankList = data
		this._editableItems = this.items
	}

	dialogClose() {
		this._dialogOpen = false
		this._dialogErrorText = null
		this.resetDialogItem()
	}

	dialogSave() {
		this._dialogType === 'new' ? this.addNewItem() : this.edit()
	}

	private resetDialogItem() {
		this._dialogItem = new Item()
	}

	private setListRef() {
		this._listRef = doc(
			this._db,
			`users/${this._authStore.user}/lists/${
				this._listOptions[this._selectedListIndex]
			}`
		)
	}

	private itemExists() {
		for (const key in this._rankList) {
			let foundItem: {
				rank: Rank
				pos: number
			}
			const rank = key as Rank
			const exists = this._rankList[rank]?.some((item, index) => {
				if (item.name === this._dialogItem.name) {
					foundItem = {
						rank: rank,
						pos: index,
					}
					return true
				} else return false
			})

			if (exists) {
				this._dialogErrorText = `Item already exists in ${
					foundItem!.rank
				} at number ${foundItem!.pos + 1}`
				return true
			} else {
				return false
			}
		}
	}

	private async saveToDb() {
		if (!this._listRef) return
		await setDoc(
			this._listRef,
			{ [this._selectedPage]: this._editableItems },
			{ merge: true }
		)
		this.resetDialogItem()
	}

	private async addNewItem() {
		if (this.itemExists()) return

		this._editableItems.push({
			name: this.dialogItem.name,
			progress: this.dialogItem.progress,
		})

		this._editableItems.sort((a, b) => a.name.localeCompare(b.name))
		this.saveToDb()
		this.dialogClose()
	}

	private async edit() {
		if (this.itemExists()) return
		this._editableItems[this._editableItemIndex] = this._dialogItem
		this._editableItems.sort((a, b) => a.name.localeCompare(b.name))
		this.saveToDb()
		this.dialogClose()
	}

	async delete() {
		this._editableItems.splice(this._editableItemIndex, 1)
		this.saveToDb()
	}
}
