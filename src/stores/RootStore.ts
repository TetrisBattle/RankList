import { FirebaseStore } from 'stores/FirebaseStore'
import { AppStore } from './AppStore'

export class RootStore {
	firebaseStore = new FirebaseStore()
	appStore = new AppStore(this.firebaseStore)
}
