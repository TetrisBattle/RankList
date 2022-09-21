import { PageId } from 'types'
import { makeAutoObservable } from 'mobx'
import FirebaseStore from './FirebaseStore'
import ListStore from './ListStore'
import RootStore from './RootStore'

export default class ItemDialogStore {
	private _firebaseStore = {} as FirebaseStore
	private _listStore = {} as ListStore
	private _item = { name: '', progress: '' }
	private _prevItemIndex = 0
	private _targetPageId: PageId = 'unknown'
	private _dialogOpen = false
	private _dialogType: 'new' | 'edit' = 'new'
	private _showEditFields = false
	private _errorText = ''

	constructor() {
		makeAutoObservable(this)
	}

	init(rootStore: RootStore) {
		this._firebaseStore = rootStore.firebaseStore
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

	itemExists(ignorePage?: string) {
		let exists = false

		this._listStore.rankList.every((page) => {
			if (page.id === ignorePage) return true

			const x = page.list.findIndex((item) => item.name === this._item.name)
			if (x === -1) return true

			exists = true
			this._errorText = `Item already exists in page ${page.label} at number ${
				x + 1
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

		let exists = this.itemExists(
			this._dialogType === 'new' ? undefined : this._targetPageId
		)
		if (exists) return

		if (this._dialogType === 'new') {
			this._firebaseStore.addNewItem({
				name: this._item.name,
				progress: this._item.progress,
			})
		} else  {
			this._firebaseStore.edit(
				this._targetPageId,
				this._prevItemIndex,
				this._item
			)
		}

		this.closeDialog()
	}
}
