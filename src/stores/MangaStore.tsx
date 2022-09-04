import { makeAutoObservable } from 'mobx'
import firebaseApp from 'firebaseApp'
import { getFirestore } from 'firebase/firestore'

export default class MangaStore {
	private firestore = getFirestore(firebaseApp)
	private _activePage = "S"

	constructor() {
		makeAutoObservable(this)
	}

	get activePage() {
		return this._activePage
	}

	set activePage(value: string) {
		this._activePage = value
		console.log(this._activePage)
	}
}
