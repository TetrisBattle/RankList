import { makeAutoObservable } from 'mobx'

export default class AppStore {
	isDarkTheme = true
	isLoading = false

	constructor() {
		makeAutoObservable(this)
	}

	toggleDarkTheme = () => {
		this.isDarkTheme = !this.isDarkTheme
	}

	setIsLoading(isLoading: boolean) {
		this.isLoading = isLoading
	}
}
