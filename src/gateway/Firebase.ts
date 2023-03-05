import {
	getAuth,
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup,
	signOut,
	User,
} from 'firebase/auth'
import {
	doc,
	DocumentData,
	DocumentReference,
	getFirestore,
	onSnapshot,
	setDoc,
} from 'firebase/firestore'
import firebaseApp from 'gateway/firebaseApp'
import { Item, ListDto, ListOption, PageId } from 'types'

export default class Firebase {
	private googleAuthProvider = new GoogleAuthProvider()
	private db = getFirestore(firebaseApp)

	async login() {
		await signInWithPopup(getAuth(), this.googleAuthProvider)
	}

	async logout() {
		await signOut(getAuth())
	}

	private getListRef(
		userId: string,
		list: ListOption
	): DocumentReference<DocumentData> {
		return doc(this.db, `users/${userId}/lists/${list}`)
	}

	async savePageToDb(
		userId: string,
		list: ListOption,
		pageId: PageId,
		items: Item[]
	) {
		const listRef = doc(this.db, `users/${userId}/lists/${list}`)
		await setDoc(listRef, { [pageId]: items }, { merge: true })
	}

	onAuthChange(callback: (user: User | null) => void) {
		const unsubUser = onAuthStateChanged(getAuth(), (user) => {
			callback(user)
		})
		return () => unsubUser()
	}

	onDataChange(
		userId: string,
		list: ListOption,
		callback: (dto: ListDto) => void
	) {
		const listRef = this.getListRef(userId, list)
		const unsubList = onSnapshot(listRef, (doc) => {
			const dto = doc.data() as ListDto
			callback(dto)
		})
		return () => unsubList()
	}
}
