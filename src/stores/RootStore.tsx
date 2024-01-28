import { FirebaseStore } from 'stores/FirebaseStore'
import { AppStore } from './AppStore'
import { ItemDialogStore } from './ItemDialogStore'
import { ListStore } from './ListStore'
import { ItemStore } from './itemStore/ItemStore'

export class RootStore {
	FirebaseStore = new FirebaseStore()

	appStore = new AppStore()
	itemStore = new ItemStore(this.FirebaseStore)
	listStore = new ListStore(this.FirebaseStore)
	itemDialogStore = new ItemDialogStore(this.listStore)
}
