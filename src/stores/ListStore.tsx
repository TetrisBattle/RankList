import Firebase from 'gateway/Firebase'
import { makeAutoObservable } from 'mobx'
import { PageId, Page, ListDto, ListOption, Item } from 'types'

export default class ListStore {
	private firebase = new Firebase()
	private _userId = 'Guest'
	private _isLoading = false
	private _listOptions: ListOption[] = ['MangaList', 'Series', 'Movies']
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
	private _selectedList: ListOption = 'MangaList'
	private _selectedPageId: PageId = 'rankS'

	constructor() {
		makeAutoObservable(this)
	}

	get userId() {
		return this._userId
	}

	set userId(value) {
		this._userId = value
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
			this.resetRankList()
		}
	}

	private savePageToDb(pageId: PageId, items: Item[]) {
		this.firebase.savePageToDb(this._userId, this._selectedList, pageId, items)
	}

	addNewItem(item: Item) {
		this.selectedPageItems.push(item)
		this.selectedPageItems.sort((a, b) => a.name.localeCompare(b.name))
		this.savePageToDb(this._selectedPageId, this.selectedPageItems)
	}

	edit(targetPageId: PageId, prevItemIndex: number, item: Item) {
		const page = this._rankList.find((page) => page.id === targetPageId)
		if (!page) return
		page.list[prevItemIndex] = item
		page.list.sort((a, b) => a.name.localeCompare(b.name))

		this.savePageToDb(targetPageId, page.list)
	}

	delete(itemIndex: number) {
		this.selectedPageItems.splice(itemIndex, 1)
		this.savePageToDb(this._selectedPageId, this.selectedPageItems)
	}

	sendTo(targetPageId: PageId, selectedItemIndex: number) {
		const targetPage = this._rankList.find((page) => page.id === targetPageId)
		const targetPageItems = targetPage?.list ?? []

		targetPageItems.push(this.selectedPageItems[selectedItemIndex])
		targetPageItems.sort((a, b) => a.name.localeCompare(b.name))
		this.savePageToDb(targetPageId, targetPageItems)
		this.delete(selectedItemIndex)
	}
}
