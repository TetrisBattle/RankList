import { PageId } from 'types'
import { makeAutoObservable } from 'mobx'
import ListStore from './ListStore'
import RootStore from './RootStore'

export default class ItemDialogStore {
	private _listStore = {} as ListStore
	private _item = { name: '', progress: '' }
	private _prevItemIndex = 0
	private _targetPageId: PageId = 'unknown'
	private _dialogOpen = false
	private _dialogType: 'new' | 'edit' = 'new'
	private _errorText = ''

	constructor() {
		makeAutoObservable(this)
	}

	init(rootStore: RootStore) {
		this._listStore = rootStore.listStore
	}

	get item() {
		return this._item
	}

	set item(value) {
		this._item = value
	}

	set name(value: string) {
		this._item.name = value
	}

	set progress(value: string) {
		this._item.progress = value
	}

	set prevItemIndex(value: number) {
		this._prevItemIndex = value
	}

	get targetPageId() {
		return this._targetPageId
	}

	set targetPageId(value) {
		this._targetPageId = value
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

	get errorText() {
		return this._errorText
	}

	openDialog() {
		this._dialogOpen = true
	}

	closeDialog() {
		this._dialogOpen = false
		this._errorText = ''
		this._item = {
			name: '',
			progress: '',
		}
	}

	itemExists() {
		let exists = false

		this._listStore.rankList.every((page) => {
			const foundItemIndex = page.list.findIndex(
				(item) => item.name.toLowerCase() === this._item.name.toLowerCase()
			)
			if (foundItemIndex === -1) return true

			exists = true
			this._errorText = `Item already exists in page ${page.label} at number ${
				foundItemIndex + 1
			}`
			return false
		})

		return exists
	}

	dialogSave() {
		if (!this._item.name) {
			this._errorText = "Name can't be empty"
			return
		}

		this._item.name = this._item.name.trim()
		this._item.progress = this._item.progress.trim()

		if (this._dialogType === 'new') {
			if (this.itemExists()) return
			this._listStore.addNewItem(this._item)
		} else {
			if (
				this._item.name.toLowerCase() !==
					this._listStore.selectedPageItems[
						this._prevItemIndex
					].name.toLowerCase() &&
				this.itemExists()
			) {
				return
			}
			this._listStore.edit(
				this._targetPageId,
				this._prevItemIndex,
				this._item
			)
		}

		this.closeDialog()
	}
}
