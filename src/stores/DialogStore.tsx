import { makeAutoObservable } from 'mobx'
import { Item } from 'stores/ListStore'

export default class DialogStore {
	private _openDialog = false
	private _dialogType = 'new'
	private _item = new Item()

	constructor() {
		makeAutoObservable(this)
	}

	get openDialog() {
		return this._openDialog
	}

	set openDialog(value: boolean) {
		if (!value) {
			this.name = ''
			this.progress = ''
		}
		this._openDialog = value
	}

	get dialogType() {
		return this._dialogType
	}

	set dialogType(value: string) {
		this._dialogType = value
	}

	get name() {
		return this._item.name
	}

	set name(value: string) {
		this._item.name = value
	}

	get progress() {
		return this._item.progress
	}

	set progress(value: string) {
		this._item.progress = value
	}
}
