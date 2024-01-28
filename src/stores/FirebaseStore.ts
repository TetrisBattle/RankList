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
	QueryDocumentSnapshot,
	setDoc,
	SnapshotOptions,
	Timestamp,
} from 'firebase/firestore'
import { firebaseApp } from 'firebaseApp'
import { makeAutoObservable } from 'mobx'
import { Item } from './itemStore/Item'

type Table = 'users' | 'mangas' | 'movies' | 'series'

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

	private putDoc = async (table: Table, entry: string, item: Item) => {
		const docRef = doc(this.db, table, entry).withConverter(
			this.itemConverter
		)
		await setDoc(docRef, item, { merge: true })
	}

	// temp = async () => {
	// 	this.putDoc('temp', 'data', { three: 'three' })
	// }

	postDatas = async (table: Table, itemDtos: ItemDto[]) => {
		itemDtos.forEach(async (itemDto) => {
			const tableRef = collection(this.db, table)
			await addDoc(tableRef, itemDto)
		})
	}

	onAuthChange() {
		const unsubUser = onAuthStateChanged(getAuth(), (user) => {
			this.setCurrentUser(user)
		})
		return unsubUser
	}
}
