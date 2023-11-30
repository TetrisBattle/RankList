import { AppStore } from './AppStore'
import { ItemDialogStore } from './ItemDialogStore'
import { ListStore } from './ListStore'

export class RootStore {
	appStore = new AppStore()
	listStore = new ListStore()
	itemDialogStore = new ItemDialogStore(this)
}
