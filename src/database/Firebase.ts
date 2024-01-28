import {
	getAuth,
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup,
	signOut,
	User,
} from 'firebase/auth'
import {
	addDoc,
	collection,
	doc,
	getDoc,
	getFirestore,
	setDoc,
	Timestamp,
} from 'firebase/firestore'
import { firebaseApp } from 'database/firebaseApp'
import { Item, ListOption, PageId } from 'types'
import { makeAutoObservable } from 'mobx'

type Table = 'users' | 'mangas' | 'movies' | 'series' | 'temp'
type Rank = 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'X' | 'unknown'
export type Data = {
	userId: string
	rank: Rank
	name: string
	progress: string
	created: Timestamp
	updated: Timestamp | null
}

export class FirebaseStore {
	private googleAuthProvider = new GoogleAuthProvider()
	private db = getFirestore(firebaseApp)
	private auth = getAuth()
	currentUser: User | null = null

	constructor() {
		makeAutoObservable(this)
	}

	setCurrentUser(user: User | null) {
		this.currentUser = user
	}

	async login() {
		await signInWithPopup(this.auth, this.googleAuthProvider)

		if (!this.currentUser) return

		const userRef = doc(this.db, 'users', this.currentUser.uid)
		const userData = (await getDoc(userRef)).data()
		if (userData) return

		await setDoc(userRef, { email: this.currentUser.email })
	}

	async logout() {
		await signOut(this.auth)
	}

	private putDoc = async (table: Table, entry: string, data: Data) => {
		const docRef = doc(this.db, table, entry)
		await setDoc(docRef, data, { merge: true })
	}

	// temp = async () => {
	// 	this.putDoc('temp', 'data', { three: 'three' })
	// }

	postDatas = async (table: Table, datas: Data[]) => {
		datas.forEach(async (data) => {
			const tableRef = collection(this.db, table)
			await addDoc(tableRef, data)
		})
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

	onAuthChange() {
		const unsubUser = onAuthStateChanged(getAuth(), (user) => {
			this.setCurrentUser(user)
		})
		return unsubUser
	}
}
