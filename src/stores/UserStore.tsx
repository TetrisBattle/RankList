import { makeAutoObservable } from 'mobx'
import {
	getAuth,
	GoogleAuthProvider,
	signInWithRedirect,
	signOut,
	User,
} from 'firebase/auth'
import { collection, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore'
import firebaseApp from 'firebaseApp'

export default class UserStore {
	private _db = getFirestore(firebaseApp)
	private _googleAuthProvider = new GoogleAuthProvider()
	private _dbPath: string | null = null

	constructor() {
		makeAutoObservable(this)
	}

	get db() {
		return this._db
	}

	get dbPath() {
		return this._dbPath
	}

	set dbPath(value) {
		this._dbPath = value
	}

	login() {
		signInWithRedirect(getAuth(), this._googleAuthProvider)
	}

	logout() {
		signOut(getAuth())
	}

	async checkIfNewUser(user: User) {
		let newUser = true
		const colRef = collection(this._db, `users`)
		const docsSnap = await getDocs(colRef)
		docsSnap.docs.forEach((doc) => {
			if (doc.id === user.email) {
				newUser = false
				return
			}
		})

		if (newUser && user.email) {
			const userRef = doc(this._db, `users`, user.email)
			await setDoc(userRef, {
				displayName: user.displayName,
			})
		}
	}
}
