import { makeAutoObservable } from 'mobx'
import AppStore from './AppStore'
import MangaStore from './MangaStore'
import MangaDialogStore from './MangaDialogStore'

export default class RootStore {
	appStore = new AppStore()
	mangaStore = new MangaStore()
	mangaDialogStore = new MangaDialogStore()

	constructor() {
		makeAutoObservable(this)
	}
}
