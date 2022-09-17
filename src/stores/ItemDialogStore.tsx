import { makeAutoObservable } from 'mobx'
import FirebaseStore from './FirebaseStore'
import ListStore, { Page } from './ListStore'
import RootStore from './RootStore'

export default class ItemDialogStore {
	private _firebaseStore = {} as FirebaseStore
	private _listStore = {} as ListStore
	private _dialogItem = {
		index: 0,
		name: '',
		progress: '',
	}
	private _dialogOpen = false
	private _dialogType = 'new'
	private _dialogErrorText: string | null = null

	constructor() {
		makeAutoObservable(this)
	}

	init(rootStore: RootStore) {
		this._firebaseStore = rootStore.firebaseStore
		this._listStore = rootStore.listStore
	}

	get dialogItem() {
		return this._dialogItem
	}

	set dialogItem(value) {
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

	get dialogType() {
		return this._dialogType
	}

	set dialogType(value) {
		this._dialogType = value
	}

	get dialogErrorText() {
		return this._dialogErrorText
	}

	openDialog() {
		this._dialogOpen = true
	}

	closeDialog() {
		this._dialogOpen = false
		this._dialogErrorText = null
		this._dialogItem = {
			index: 0,
			name: '',
			progress: '',
		}
	}

	itemExists(newItemName: string): {
		page: string
		pos: number
	} | null {
		for (const key in this._listStore.rankList) {
			let existingItem: {
				page: string
				pos: number
			} | null = null
			const rank = key as Page
			this._listStore.rankList[rank]?.forEach((item, index) => {
				if (item.name === newItemName) {
					existingItem = {
						page: rank,
						pos: index,
					}
					return
				}
			})
			if (existingItem) return existingItem
		}
		return null
	}

	setupDialogError(existingItem: { page: string; pos: number }) {
		const rankPage = this._listStore.pageOptions.rankPages.find(
			(page) => page.value === existingItem.page
		)
		this._dialogErrorText = `Item already exists in page ${
			rankPage?.displayName
		} at number ${existingItem.pos + 1}`
	}

	dialogSave() {
		if (!this.dialogItem.name) {
			this._dialogErrorText = "Name can't be empty"
			return
		}

		if (this.dialogType === 'new') {
			const existingItem = this.itemExists(this.dialogItem.name)
			if (existingItem) {
				this.setupDialogError(existingItem)
				return
			}
			this._firebaseStore.addNewItem()
		} else if (this.dialogType === 'edit') {
			if (this._listStore.editableItemIndex === null) return
			const selectedItem =
				this._listStore.items[this._listStore.editableItemIndex]
			const existingItem = this.itemExists(this.dialogItem.name)
			if (selectedItem.name !== this.dialogItem.name && existingItem) {
				this.setupDialogError(existingItem)
				return
			}
			this._firebaseStore.edit()
		}

		this.closeDialog()
	}
}
