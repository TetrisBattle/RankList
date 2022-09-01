import { makeAutoObservable } from 'mobx'

export default class MangaStore {
	private _activePage = "S"

	constructor() {
		makeAutoObservable(this)
	}

	get activePage() {
		return this._activePage
	}

	set activePage(value: string) {
		this._activePage = value
		console.log(this._activePage)
	}
}
