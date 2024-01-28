import { FirebaseStore } from 'database/Firebase'
import { AppStore } from './AppStore'
import { ItemDialogStore } from './ItemDialogStore'
import { ListStore } from './ListStore'

export class RootStore {
	firebase = new FirebaseStore()

	appStore = new AppStore()
	listStore = new ListStore(this.firebase)
	itemDialogStore = new ItemDialogStore(this.listStore)
}
