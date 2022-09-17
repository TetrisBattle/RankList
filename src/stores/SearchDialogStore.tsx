import { makeAutoObservable } from 'mobx'

export default class SearchDialogStore {
	private _dialogOpen = false

	constructor() {
		makeAutoObservable(this)
	}

	get dialogOpen() {
		return this._dialogOpen
	}

	openDialog() {
		this._dialogOpen = true
	}

	closeDialog() {
		this._dialogOpen = false
	}
}
