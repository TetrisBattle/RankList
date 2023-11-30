import {
	getAuth,
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup,
	signOut,
	User,
} from 'firebase/auth'
import { doc, getFirestore, onSnapshot, setDoc } from 'firebase/firestore'
import { firebaseApp } from 'database/firebaseApp'
import { Item, ListDto, ListOption, PageId } from 'types'

export class Firebase {
	private googleAuthProvider = new GoogleAuthProvider()
	private firestore = getFirestore(firebaseApp)

	async login() {
		await signInWithPopup(getAuth(), this.googleAuthProvider)
	}

	async logout() {
		await signOut(getAuth())
	}

	private getListRef(userId: string, list: ListOption) {
		return doc(this.firestore, `users/${userId}/lists/${list}`)
	}

	async savePageToDb(
		userId: string,
		list: ListOption,
		pageId: PageId,
		items: Item[]
	) {
		const listRef = doc(this.firestore, `users/${userId}/lists/${list}`)
		await setDoc(listRef, { [pageId]: items }, { merge: true })
	}

	onAuthChange(callback: (user: User | null) => void) {
		const unsubUser = onAuthStateChanged(getAuth(), (user) => {
			callback(user)
		})
		return unsubUser
	}

	onDataChange(
		userId: string,
		list: ListOption,
		callback: (dto: ListDto | undefined) => void
	) {
		const listRef = this.getListRef(userId, list)
		const unsubList = onSnapshot(listRef, (doc) => {
			const dto: ListDto | undefined = doc.data()
			callback(dto)
		})
		return unsubList
	}
}
