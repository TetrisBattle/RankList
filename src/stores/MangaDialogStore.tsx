import { makeAutoObservable } from 'mobx'
import { Manga } from 'stores/MangaStore'

export default class MangaStore {
	private _openDialog = false
	private _dialogType = 'new'
	private _manga = new Manga()

	constructor() {
		makeAutoObservable(this)
	}

	get openDialog() {
		return this._openDialog
	}

	set openDialog(value: boolean) {
		if (!value) {
			this.mangaName = ''
			this.mangaChapter = ''
		}
		this._openDialog = value
	}

	get dialogType() {
		return this._dialogType
	}

	set dialogType(value: string) {
		this._dialogType = value
	}

	get mangaId() {
		return this._manga.id
	}

	set mangaId(value: string) {
		this._manga.id = value
	}

	get mangaName() {
		return this._manga.name
	}

	set mangaName(value: string) {
		this._manga.name = value
	}

	get mangaChapter() {
		return this._manga.chapter
	}

	set mangaChapter(value: string) {
		this._manga.chapter = value
	}
}
