import { makeAutoObservable } from 'mobx'
import AppStore from './AppStore'
import UserStore from './UserStore'
import MangaStore from './MangaStore'
import MangaDialogStore from './MangaDialogStore'

export default class RootStore {
	appStore = new AppStore()
	userStore = new UserStore()
	mangaStore = new MangaStore()
	mangaDialogStore = new MangaDialogStore()

	constructor() {
		makeAutoObservable(this)
	}
}
