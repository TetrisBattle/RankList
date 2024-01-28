import { FirebaseStore } from 'stores/FirebaseStore'
import { AppStore } from './AppStore'
import { ItemDialogStore } from './ItemDialogStore'
import { ListStore } from './ListStore'

export class RootStore {
	FirebaseStore = new FirebaseStore()

	appStore = new AppStore()
	listStore = new ListStore(this.FirebaseStore)
	itemDialogStore = new ItemDialogStore(this.listStore)
}
