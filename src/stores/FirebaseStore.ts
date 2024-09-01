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
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	query,
	setDoc,
	Timestamp,
	updateDoc,
	where,
} from 'firebase/firestore'
import { firebaseApp } from 'firebaseApp'
import { Item } from '../models/Item'
import { makeAutoObservable, runInAction } from '@thng/react'

export type Table = 'mangas' | 'movies' | 'series'
export const tableOptions: Table[] = ['mangas', 'movies', 'series']

export type Rank = 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'X' | '?' | 'Z'
export const rankOptions: Rank[] = ['S', 'A', 'B', 'C', 'D', 'E', 'F', 'X', '?']

export type ItemDto = {
	userId: string
	name: string
	progress: string
	rank: Rank
	completed: boolean
	created: Timestamp
	updated: Timestamp | null
}

export class FirebaseStore {
	private googleAuthProvider = new GoogleAuthProvider()
	private db = getFirestore(firebaseApp)
	private auth = getAuth()
	currentUser: User | null = null
	isLoading = true

	constructor() {
		makeAutoObservable(this)
	}

	setCurrentUser(user: User | null) {
		this.currentUser = user
	}

	onAuthChange = async (cb: (user: User | null) => Promise<void>) => {
		onAuthStateChanged(this.auth, async (user) => {
			this.setCurrentUser(user)
			cb(user)

			runInAction(() => {
				this.isLoading = false
			})
		})
	}

	login = async () => {
		await signInWithPopup(this.auth, this.googleAuthProvider)

		if (!this.currentUser) return

		const userRef = doc(this.db, 'users', this.currentUser.uid)
		const userData = (await getDoc(userRef)).data()
		if (userData) return

		await setDoc(userRef, { email: this.currentUser.email })
	}

	logout = async () => {
		await signOut(this.auth)
	}

	getUserData = async (table: Table) => {
		if (!this.currentUser) throw new Error('User is not logged in')
		const tableRef = collection(this.db, table)
		const q = query(tableRef, where('userId', '==', this.currentUser.uid))
		const snapshot = await getDocs(q)
		const items = snapshot.docs.map((doc) => {
			const ItemDto = doc.data() as ItemDto
			return Item.convertFromDto(doc.id, ItemDto)
		}) as Item[]
		return items
	}

	post = async (table: Table, item: Item) => {
		if (!this.currentUser) throw new Error('User is not logged in')

		item.userId = this.currentUser.uid
		const itemDto = item.convertToDto()

		const tableRef = collection(this.db, table)
		const savedDoc = await addDoc(tableRef, itemDto)
		item.id = savedDoc.id
		return item
	}

	put = async (table: Table, item: Item) => {
		const docRef = doc(this.db, table, item.id)
		await updateDoc(docRef, {
			name: item.name,
			progress: item.progress,
			rank: item.rank,
			completed: item.completed,
			updated: Timestamp.fromDate(new Date()),
		})
	}

	delete = async (table: Table, itemId: string) => {
		const docRef = doc(this.db, table, itemId)
		await deleteDoc(docRef)
	}

	addColumn = async ({ name, value }: { name: string; value: any }) => {
		// Data cannot be manipulated if user is not logged in
		if (!this.currentUser) throw new Error('User is not logged in')

		tableOptions.forEach(async (table) => {
			const colRef = collection(this.db, table)
			const docSnap = await getDocs(colRef)

			docSnap.docs.forEach(async (document) => {
				if (document.data()[name] !== undefined)
					throw new Error('Column already exists!')

				const docRef = doc(this.db, table, document.id)
				await updateDoc(docRef, {
					[name]: value,
				})
			})
		})

		console.log('Done!')
	}
}
