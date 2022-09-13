import { makeAutoObservable } from 'mobx'
import {
	getAuth,
	GoogleAuthProvider,
	signInWithRedirect,
	signOut,
} from 'firebase/auth'

export default class AuthStore {
	private _googleAuthProvider = new GoogleAuthProvider()
	private _user: string | null | undefined = null

	constructor() {
		makeAutoObservable(this)
	}

	get user() {
		return this._user
	}

	set user(value) {
		this._user = value
	}

	login() {
		signInWithRedirect(getAuth(), this._googleAuthProvider)
	}

	logout() {
		signOut(getAuth())
	}
}
