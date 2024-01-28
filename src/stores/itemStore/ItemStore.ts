import { makeAutoObservable } from 'mobx'
import { FirebaseStore } from 'stores/FirebaseStore'

export class ItemStore {
	constructor(private db: FirebaseStore) {
		makeAutoObservable(this)
	}
}
