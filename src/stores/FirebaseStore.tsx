import { makeAutoObservable } from 'mobx'
import {
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
} from 'firebase/auth'
import {
	doc,
	DocumentData,
	DocumentReference,
	getFirestore,
	setDoc,
} from 'firebase/firestore'
import firebaseApp from 'firebaseApp'
import RootStore from './RootStore'
import ListStore from './ListStore'
import DialogStore from './DialogStore'

export default class FirebaseStore {
	private _listStore = {} as ListStore
	private _dialogStore = {} as DialogStore
	private _googleAuthProvider = new GoogleAuthProvider()
	private _db = getFirestore(firebaseApp)
	private _listRef: DocumentReference<DocumentData> | null = null
	private _user: string | null | undefined = null

	constructor() {
		makeAutoObservable(this)
	}

	init(rootStore: RootStore) {
		this._listStore = rootStore.listStore
		this._dialogStore = rootStore.dialogStore
	}

	get user() {
		return this._user
	}

	set user(value) {
		this._user = value
	}

	get listRef() {
		return this._listRef
	}

	login() {
		signInWithPopup(getAuth(), this._googleAuthProvider)
	}

	logout() {
		signOut(getAuth())
	}

	setupListRef() {
		if (this.user) {
			this._listRef = doc(
				this._db,
				`users/${this.user}/lists/${
					this._listStore.listOptions[this._listStore.selectedListIndex]
				}`
			)
		} else {
			this._listRef = null
		}
	}

	private async saveToDb() {
		if (!this._listRef) return
		await setDoc(
			this._listRef,
			{ [this._listStore.selectedPage]: this._listStore.items },
			{ merge: true }
		)
	}

	addNewItem() {
		this._listStore.items.push({
			name: this._dialogStore.dialogItem.name,
			progress: this._dialogStore.dialogItem.progress,
		})
		this._listStore.items.sort((a, b) => a.name.localeCompare(b.name))
		this.saveToDb()
	}

	edit() {
		if (this._listStore.editableItemIndex === null) return
		this._listStore.items[this._listStore.editableItemIndex] = {
			name: this._dialogStore.dialogItem.name,
			progress: this._dialogStore.dialogItem.progress,
		}
		this._listStore.items.sort((a, b) => a.name.localeCompare(b.name))
		this.saveToDb()
	}

	delete(index: number) {
		this._listStore.items.splice(index, 1)
		this.saveToDb()
	}
}
