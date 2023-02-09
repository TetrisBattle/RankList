import AppStore from './AppStore'
import ItemDialogStore from './ItemDialogStore'
import ListStore from './ListStore'
import SearchDialogStore from './SearchDialogStore'

export default class RootStore {
	appStore = new AppStore()
	listStore = new ListStore()
	itemDialogStore = new ItemDialogStore()
	searchDialogStore = new SearchDialogStore()

	constructor() {
		this.itemDialogStore.init(this)
	}
}
