import { makeAutoObservable } from 'mobx'

export default class AppStore {
	private _devMode = false
	private _isDarkTheme = true
	private _isLoading = false

	constructor() {
		makeAutoObservable(this)
	}

	get devMode() {
		return this._devMode
	}

	get isDarkTheme() {
		return this._isDarkTheme
	}

	toggleDarkTheme = () => {
		this._isDarkTheme = !this._isDarkTheme
	}

	get isLoading() {
		return this._isLoading
	}

	set isLoading(value: boolean) {
		this._isLoading = value
	}
}
