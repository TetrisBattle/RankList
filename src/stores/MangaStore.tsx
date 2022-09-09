import { makeAutoObservable } from 'mobx'
import firebaseApp from 'firebaseApp'
import {
	getFirestore,
	collection,
	getDocs,
	addDoc,
	setDoc,
	deleteDoc,
	doc,
	query,
	orderBy,
} from 'firebase/firestore'

export class Manga {
	constructor(public id = '', public name = '', public chapter = '') {
		makeAutoObservable(this)
	}
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

	async updateMangaList() {
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
			chapter: chapter,
		})
		this.updateMangaList()
	}

	async edit(id: string, name: string, chapter: string) {
		const ref = doc(this._db, `${this._mangaPath}/${this._activePage}`, id)
		await setDoc(ref, {
			name: name,
			chapter: chapter,
		})

		const index = this.mangas.findIndex((manga) => manga.id === id)
		const copy = JSON.parse(JSON.stringify(this.mangas))
		copy[index].name = name
		copy[index].chapter = chapter
		copy.sort((a: Manga, b: Manga) => {
			if (a.name.toUpperCase() > b.name.toUpperCase()) return 1
			else return -1
		})
		this.mangas = copy
	}

	async delete(id: string) {
		const ref = doc(this._db, `${this._mangaPath}/${this._activePage}`, id)
		await deleteDoc(ref)
		this.mangas = this.mangas.filter((manga) => manga.id !== id)
	}
}
