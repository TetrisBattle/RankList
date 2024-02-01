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
	QueryDocumentSnapshot,
	setDoc,
	SnapshotOptions,
	Timestamp,
	updateDoc,
	where,
} from 'firebase/firestore'
import { firebaseApp } from 'firebaseApp'
import { Item } from './models/Item'
import { makeAutoObservable } from '@thng/react'

export type Table = 'users' | 'mangas' | 'movies' | 'series'

export type Rank = 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'X' | '?'
export const rankOptions: Rank[] = ['S', 'A', 'B', 'C', 'D', 'E', 'F', 'X', '?']

export type ItemDto = {
	userId: string
	name: string
	progress: string
	rank: Rank
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

	private get itemConverter() {
		return {
			toFirestore: (item: Item): ItemDto => {
				if (!this.currentUser) throw new Error('User is not logged in')
				item.userId = this.currentUser.uid
				return item.convertToDto()
			},
			fromFirestore: (
				snapshot: QueryDocumentSnapshot<ItemDto, ItemDto>,
				options?: SnapshotOptions
			): Item => {
				const itemDto = snapshot.data(options)
				return Item.convertFromDto(snapshot.id, itemDto)
			},
		}
	}

	onAuthChange = async (cb: (user: Item[]) => void) => {
		onAuthStateChanged(getAuth(), async (user) => {
			this.setCurrentUser(user)

			if (!user) return cb([])

			const datas = await this.getUserData('mangas')
			cb(datas)
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
		return items.sort((a, b) => a.name.localeCompare(b.name))
	}

	post = async (table: Table, item: Item) => {
		const tableRef = collection(this.db, table).withConverter(
			this.itemConverter
		)
		const savedDoc = await addDoc(tableRef, item)
		item.id = savedDoc.id
		return item
	}

	put = async (table: Table, item: Item) => {
		const docRef = doc(this.db, table, item.id)
		await updateDoc(docRef, {
			name: item.name,
			progress: item.progress,
			rank: item.rank,
			updated: Timestamp.fromDate(new Date()),
		})
	}

	delete = async (table: Table, itemId: string) => {
		const docRef = doc(this.db, table, itemId)
		await deleteDoc(docRef)
	}
}
