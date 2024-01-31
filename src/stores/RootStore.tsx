import { FirebaseStore } from 'stores/FirebaseStore'
import { AppStore } from './AppStore'
import { ItemStore } from './itemStore/ItemStore'

export class RootStore {
	firebaseStore = new FirebaseStore()
	appStore = new AppStore()
	itemStore = new ItemStore(this.firebaseStore, this.appStore)
}
