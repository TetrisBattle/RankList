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
	where,
} from 'firebase/firestore'
import { firebaseApp } from 'firebaseApp'
import { Item } from './itemStore/Item'
import { makeAutoObservable } from '@thng/react'

export type Table = 'users' | 'mangas' | 'movies' | 'series'

export type Rank = 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'X' | 'unknown'

export type ItemDto = {
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

	private get itemConverter() {
		return {
			toFirestore: (item: Item): ItemDto => {
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

			const datas = await this.getDatas('mangas')
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

	getDatas = async (table: Table) => {
		const tableRef = collection(this.db, table)
		const q = query(tableRef, where('userId', '==', this.currentUser?.uid))
		const snapshot = await getDocs(q)
		const items = snapshot.docs.map((doc) => {
			const ItemDto = doc.data() as ItemDto
			return Item.convertFromDto(doc.id, ItemDto)
		}) as Item[]
		return items.sort((a, b) => a.name.localeCompare(b.name))
	}

	writeData = async (table: Table, item: Item) => {
		const docRef = doc(this.db, table, item.id).withConverter(
			this.itemConverter
		)
		await setDoc(docRef, item, { merge: true })
	}

	deleteData = async (table: Table, itemId: string) => {
		const docRef = doc(this.db, table, itemId)
		await deleteDoc(docRef)
	}

	writeDatas = async (table: Table, itemDtos: ItemDto[]) => {
		itemDtos.forEach(async (itemDto) => {
			const tableRef = collection(this.db, table)
			await addDoc(tableRef, itemDto)
		})
	}
}
