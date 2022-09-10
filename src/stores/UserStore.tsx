import { makeAutoObservable } from 'mobx'
import {
	getAuth,
	GoogleAuthProvider,
	signInWithRedirect,
	signOut,
	User,
} from 'firebase/auth'

export default class UserStore {
	private _googleAuthProvider = new GoogleAuthProvider()
	private _currentUser: User | null | undefined

	constructor() {
		makeAutoObservable(this)
	}

	get currentUser() {
		return this._currentUser
	}

	set currentUser(value: User | null | undefined) {
		this._currentUser = value
	}

	login() {
		signInWithRedirect(getAuth(), this._googleAuthProvider)
	}

	logout() {
		signOut(getAuth())
	}
}
