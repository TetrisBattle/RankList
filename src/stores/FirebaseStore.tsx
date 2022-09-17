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
import ListStore, { Page } from './ListStore'
import ItemDialogStore from './ItemDialogStore'

export default class FirebaseStore {
	private _listStore = {} as ListStore
	private _itemDialogStore = {} as ItemDialogStore
	private _googleAuthProvider = new GoogleAuthProvider()
	private _db = getFirestore(firebaseApp)
	private _listRef: DocumentReference<DocumentData> | null = null
	private _user: string | null | undefined = null

	constructor() {
		makeAutoObservable(this)
	}

	init(rootStore: RootStore) {
		this._listStore = rootStore.listStore
		this._itemDialogStore = rootStore.itemDialogStore
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

	private async savePageToDb() {
		if (!this._listRef) return
		await setDoc(
			this._listRef,
			{ [this._listStore.selectedPage]: this._listStore.items },
			{ merge: true }
		)
	}

	addNewItem() {
		this._listStore.items.push({
			name: this._itemDialogStore.dialogItem.name,
			progress: this._itemDialogStore.dialogItem.progress,
		})
		this._listStore.items.sort((a, b) => a.name.localeCompare(b.name))
		this.savePageToDb()
	}

	edit() {
		if (this._listStore.editableItemIndex === null) return
		this._listStore.items[this._listStore.editableItemIndex] = {
			name: this._itemDialogStore.dialogItem.name,
			progress: this._itemDialogStore.dialogItem.progress,
		}
		this._listStore.items.sort((a, b) => a.name.localeCompare(b.name))
		this.savePageToDb()
	}

	delete(index: number) {
		this._listStore.items.splice(index, 1)
		this.savePageToDb()
	}

	async sendTo(index: number, page: Page) {
		if (!this._listRef) return

		const targetList = this._listStore.rankList[page]
		if (!targetList) {
			this._listStore.rankList[page] = [this._listStore.items[index]]
		} else {
			targetList.push(this._listStore.items[index])
			targetList.sort((a, b) => a.name.localeCompare(b.name))
		}

		this.delete(index)
		await setDoc(this._listRef, this._listStore.rankList, { merge: true })
	}
}
