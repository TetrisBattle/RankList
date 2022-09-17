import AppStore from './AppStore'
import FirebaseStore from './FirebaseStore'
import ItemDialogStore from './ItemDialogStore'
import ListStore from './ListStore'
import SearchDialogStore from './SearchDialogStore'

export default class RootStore {
	appStore = new AppStore()
	firebaseStore = new FirebaseStore()
	listStore = new ListStore()
	itemDialogStore = new ItemDialogStore()
	searchDialogStore = new SearchDialogStore()

	constructor() {
		this.firebaseStore.init(this)
		this.listStore.init(this)
		this.itemDialogStore.init(this)
	}
}
