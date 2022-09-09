import { makeAutoObservable } from 'mobx'

export default class MangaStore {
	private _openDialog = false
	private _dialogType = 'new'
	private _name = ''
	private _chapter = ''

	constructor() {
		makeAutoObservable(this)
	}

	get openDialog() {
		return this._openDialog
	}

	set openDialog(value: boolean) {
		if (!value) {
			this.name = ''
			this.chapter = ''
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
		return this._name
	}

	set name(value: string) {
		this._name = value
	}

	get chapter() {
		return this._chapter
	}

	set chapter(value: string) {
		this._chapter = value
	}
}
