import { makeAutoObservable } from 'mobx'
import RootStore from './RootStore'
import FirebaseStore from './FirebaseStore'
import { PageId, Page, ListDto } from 'types'

export default class ListStore {
	private _firebaseStore = {} as FirebaseStore
	private _isLoading = false
	private _listOptions = ['MangaList', 'Series', 'Movies']
	private _emptyRankList: Page[] = [
		{
			id: 'rankS',
			label: 'S',
			list: [],
		},
		{
			id: 'rankA',
			label: 'A',
			list: [],
		},
		{
			id: 'rankB',
			label: 'B',
			list: [],
		},
		{
			id: 'rankC',
			label: 'C',
			list: [],
		},
		{
			id: 'rankD',
			label: 'D',
			list: [],
		},
		{
			id: 'rankE',
			label: 'E',
			list: [],
		},
		{
			id: 'rankF',
			label: 'F',
			list: [],
		},
		{
			id: 'special',
			label: 'X',
			list: [],
		},
		{
			id: 'unknown',
			label: '?',
			list: [],
		},
	]
	private _rankList: Page[] = JSON.parse(JSON.stringify(this._emptyRankList))
	private _selectedList = 'MangaList'
	private _selectedPageId: PageId = 'rankS'

	constructor() {
		makeAutoObservable(this)
	}

	init(rootStore: RootStore) {
		this._firebaseStore = rootStore.firebaseStore
	}

	get rankList() {
		return this._rankList
	}

	get listOptions() {
		return this._listOptions
	}

	get isLoading() {
		return this._isLoading
	}

	set isLoading(value) {
		this._isLoading = value
	}

	get selectedList() {
		return this._selectedList
	}

	set selectedList(value) {
		this._selectedList = value
		this._firebaseStore.setupListRef()
	}

	get selectedPage() {
		return this._selectedPageId
	}

	set selectedPage(value) {
		this._selectedPageId = value
	}

	get selectedPageItems() {
		const page = this._rankList.find((page) => page.id === this._selectedPageId)
		return page?.list ?? []
	}

	resetRankList() {
		this._rankList = JSON.parse(JSON.stringify(this._emptyRankList))
	}

	setupRankListFromDto(dto: ListDto | undefined) {
		if (dto) {
			this._rankList.forEach((page) => {
				page.list = dto[page.id] ?? []
			})
		} else {
			console.log('do this')
			this.resetRankList()
		}
	}
}
