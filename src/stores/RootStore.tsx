import { makeAutoObservable } from 'mobx'
import AppStore from './AppStore'
import UserStore from './UserStore'
import ListStore from './ListStore'
import DialogStore from './DialogStore'

export default class RootStore {
	appStore = new AppStore()
	userStore = new UserStore()
	listStore = new ListStore()
	dialogStore = new DialogStore()

	constructor() {
		makeAutoObservable(this)
	}
}
