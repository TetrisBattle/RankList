import { makeAutoObservable } from 'mobx'
import AppStore from './AppStore'
import MangaStore from './MangaStore'

export default class RootStore {
	appStore = new AppStore()
	mangaStore = new MangaStore()

	constructor() {
		makeAutoObservable(this)
	}
}
