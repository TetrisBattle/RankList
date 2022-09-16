import AppStore from './AppStore'
import FirebaseStore from './FirebaseStore'
import DialogStore from './DialogStore'
import ListStore from './ListStore'

export default class RootStore {
	appStore = new AppStore()
	firebaseStore = new FirebaseStore()
	listStore = new ListStore()
	dialogStore = new DialogStore()

	constructor() {
		this.firebaseStore.init(this)
		this.listStore.init(this)
		this.dialogStore.init(this)
	}
}
