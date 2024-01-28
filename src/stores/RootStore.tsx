import { FirebaseStore } from 'stores/FirebaseStore'
import { AppStore } from './AppStore'
import { ItemDialogStore } from './ItemDialogStore'
import { ListStore } from './ListStore'
import { ItemStore } from './itemStore/ItemStore'

export class RootStore {
	firebaseStore = new FirebaseStore()
	appStore = new AppStore()
	itemStore = new ItemStore(this.firebaseStore, this.appStore)

	listStore = new ListStore(this.firebaseStore)
	itemDialogStore = new ItemDialogStore(this.listStore)
}
