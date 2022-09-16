import { makeAutoObservable } from 'mobx'
import RootStore from './RootStore'
import FirebaseStore from './FirebaseStore'
import Item from 'models/Item'

interface RankList {
	rankS?: Item[]
	rankA?: Item[]
	rankB?: Item[]
	rankC?: Item[]
	rankD?: Item[]
	rankE?: Item[]
	rankF?: Item[]
	special?: Item[]
	unknown?: Item[]
}

export type Page =
	| 'rankS'
	| 'rankA'
	| 'rankB'
	| 'rankC'
	| 'rankD'
	| 'rankE'
	| 'rankF'
	| 'special'
	| 'unknown'

interface PageOptions {
	rankPages: {
		value: Page
		displayName: string
	}[]
	extraPages: {
		value: Page
		displayName: string
	}[]
}

export default class ListStore {
	private _firebaseStore = {} as FirebaseStore
	private _listOptions = ['MangaList', 'Series', 'Movies']
	private _pageOptions: PageOptions = {
		rankPages: [
			{
				value: 'rankS',
				displayName: 'S',
			},
			{
				value: 'rankA',
				displayName: 'A',
			},
			{
				value: 'rankB',
				displayName: 'B',
			},
			{
				value: 'rankC',
				displayName: 'C',
			},
			{
				value: 'rankD',
				displayName: 'D',
			},
			{
				value: 'rankE',
				displayName: 'E',
			},
			{
				value: 'rankF',
				displayName: 'F',
			},
		],
		extraPages: [
			{
				value: 'special',
				displayName: 'X',
			},
			{
				value: 'unknown',
				displayName: '?',
			},
		],
	}

	private _isLoading = false
	private _rankList: RankList = {}
	private _editableItemIndex: number | null = null

	private _selectedListIndex = 0
	private _selectedPage: Page = 'rankS'

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

	get pageOptions() {
		return this._pageOptions
	}

	get isLoading() {
		return this._isLoading
	}

	set isLoading(value) {
		this._isLoading = value
	}

	set rankList(value: RankList) {
		this._rankList = value
	}

	get items() {
		return this._rankList[this.selectedPage] ?? []
	}

	get selectedListIndex() {
		return this._selectedListIndex
	}

	set selectedListIndex(value) {
		this._selectedListIndex = value
		this._firebaseStore.setupListRef()
	}

	get selectedList() {
		return this._listOptions[this._selectedListIndex]
	}

	get selectedPage() {
		return this._selectedPage
	}

	set selectedPage(value) {
		this._selectedPage = value
	}

	get editableItemIndex() {
		return this._editableItemIndex
	}

	set editableItemIndex(value) {
		this._editableItemIndex = value
	}
}
