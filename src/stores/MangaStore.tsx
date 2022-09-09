import { makeAutoObservable } from 'mobx'
import firebaseApp from 'firebaseApp'
import {
	getFirestore,
	collection,
	getDocs,
	addDoc,
	deleteDoc,
	doc,
	query,
	orderBy,
} from 'firebase/firestore'

class Manga {
	constructor(public id: string, public name: string, public chapter: string) {}
}

export default class MangaStore {
	private _mangas: Manga[] = []
	private _isLoading = true
	private _activePage = 'rankS'
	private _db = getFirestore(firebaseApp)
	private _mangaPath = 'users/xTrouble/lists/manga'

	constructor() {
		makeAutoObservable(this)
	}

	get isLoading() {
		return this._isLoading
	}

	set isLoading(value: boolean) {
		this._isLoading = value
	}

	get activePage() {
		return this._activePage
	}

	set activePage(value: string) {
		this._activePage = value
	}

	get mangas() {
		return this._mangas
	}

	private set mangas(value: Manga[]) {
		this._mangas = value
	}

	async updateMangas() {
		this.mangas = []
		this.isLoading = true
		const mangas: Manga[] = []

		const ref = collection(this._db, `${this._mangaPath}/${this._activePage}`)
		const q = query(ref, orderBy('name', 'asc'))
		const snapshot = await getDocs(q)

		snapshot.docs.forEach((doc) => {
			mangas.push(new Manga(doc.id, doc.data().name, doc.data().chapter))
		})

		this.mangas = mangas
		this.isLoading = false
	}

	async saveNewManga(name: string, chapter: string) {
		const ref = collection(this._db, `${this._mangaPath}/${this._activePage}`)
		await addDoc(ref, {
			name: name,
			chapter: chapter
		})
		this.updateMangas()
	}

	async delete(id: string) {
		const ref = doc(this._db, `${this._mangaPath}/${this._activePage}`, id)
		await deleteDoc(ref)
		this.updateMangas()
	}
}
