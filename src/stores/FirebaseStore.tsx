import { makeAutoObservable } from 'mobx'
import {
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
} from 'firebase/auth'
import {
	doc,
	DocumentReference,
	getFirestore,
	setDoc,
} from 'firebase/firestore'
import firebaseApp from 'firebaseApp'
import RootStore from './RootStore'
import ListStore from './ListStore'
import { PageId, ListDto, Item } from 'types'

export default class FirebaseStore {
	private _listStore = {} as ListStore
	private _googleAuthProvider = new GoogleAuthProvider()
	private _db = getFirestore(firebaseApp)
	private _user = 'Guest'
	private _listRef: DocumentReference<ListDto> = doc(this._db, 'error/doc')

	constructor() {
		makeAutoObservable(this)
	}

	init(rootStore: RootStore) {
		this._listStore = rootStore.listStore
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
		this._listRef = doc(
			this._db,
			`users/${this.user}/lists/${this._listStore.selectedList}`
		)
	}

	private async savePageToDb(pageId: PageId, items: Item[]) {
		await setDoc(this._listRef, { [pageId]: items }, { merge: true })
	}

	addNewItem(item: Item) {
		this._listStore.selectedPageItems.push(item)
		this._listStore.selectedPageItems.sort((a, b) =>
			a.name.localeCompare(b.name)
		)
		this.savePageToDb(
			this._listStore.selectedPage,
			this._listStore.selectedPageItems
		)
	}

	edit(targetPageId: PageId, prevItemIndex: number, item: Item) {
		const page = this._listStore.rankList.find(
			(page) => page.id === targetPageId
		)
		if (!page) return
		page.list[prevItemIndex] = item
		page.list.sort((a, b) => a.name.localeCompare(b.name))
		this.savePageToDb(targetPageId, page.list)
	}

	delete(itemIndex: number) {
		this._listStore.selectedPageItems.splice(itemIndex, 1)
		this.savePageToDb(
			this._listStore.selectedPage,
			this._listStore.selectedPageItems
		)
	}

	sendTo(targetPageId: PageId, selectedItemIndex: number) {
		const targetPage = this._listStore.rankList.find(
			(page) => page.id === targetPageId
		)
		const targetPageItems = targetPage?.list ?? []

		targetPageItems.push(this._listStore.selectedPageItems[selectedItemIndex])
		targetPageItems.sort((a, b) => a.name.localeCompare(b.name))
		this.savePageToDb(targetPageId, targetPageItems)
		this.delete(selectedItemIndex)
	}
}
