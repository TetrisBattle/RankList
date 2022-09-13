import { makeAutoObservable } from 'mobx'
import AppStore from './AppStore'
import AuthStore from './AuthStore'
import ListStore from './ListStore'

export default class RootStore {
	appStore = new AppStore()
	authStore = new AuthStore()
	listStore = new ListStore()

	constructor() {
		makeAutoObservable(this)
	}
}
