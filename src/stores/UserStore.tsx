import { makeAutoObservable } from 'mobx'
import {
	getAuth,
	signInWithPopup,
	// signInWithRedirect,
	// getRedirectResult,
	GoogleAuthProvider,
	signOut,
	User,
} from 'firebase/auth'

export default class UserStore {
	private _googleAuthProvider = new GoogleAuthProvider()
	private _currentUser: User | null = null

	constructor() {
		makeAutoObservable(this)
	}

	get currentUser() {
		return this._currentUser
	}

	set currentUser(value: User | null) {
		this._currentUser = value
	}

	login() {
		signInWithPopup(getAuth(), this._googleAuthProvider)
			.then(() => {
				console.log('login')
			})
		// signInWithRedirect(this._auth, this._googleAuthProvider)
	}

	logout() {
		signOut(getAuth())
			.then(() => {
				console.log('logout')
			})
			.catch((error) => {
				console.log('ERROR', error)
			})
	}

	getData() {
		console.log('user', getAuth().currentUser)
		// getRedirectResult(getAuth())
		// 	.then((result: any) => {
		// 		// if(!result) authFunc()
		// 		// const credential = GoogleAuthProvider.credentialFromResult(result)
		// 		// const token = credential?.accessToken

		// 		// const user = result.user
		// 		console.log('user', this.currentUser, result, getAuth().currentUser)
		// 	})
		// 	.catch((error: any) => {
		// 		console.error('ERROR', error)
		// 	})
	}
}
