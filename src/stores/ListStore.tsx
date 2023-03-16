import Firebase from 'gateway/Firebase'
import { makeAutoObservable } from 'mobx'
import { PageId, Page, ListDto, ListOption, Item } from 'types'

export default class ListStore {
	private firebase = new Firebase()
	userId = 'Guest'
	isLoading = false
	listOptions: ListOption[] = ['MangaList', 'Series', 'Movies']
	rankList: Page[] = []
	selectedList: ListOption = 'MangaList'
	selectedPageId: PageId = 'rankS'

	constructor() {
		this.resetRankList()
		makeAutoObservable(this)
	}

	setUserId(userId: string) {
		this.userId = userId
	}

	// this is unused at the moment
	setIsLoading(isLoading: boolean) {
		this.isLoading = isLoading
	}

	setSelectedList(selectedList: ListOption) {
		this.setSelectedList(selectedList)
	}

	setSelectedPageId(value: PageId) {
		this.selectedPageId = value
	}

	getPageItems(pageId: PageId) {
		const page = this.rankList.find((page) => page.id === pageId)
		return page?.list ?? []
	}

	get selectedPageItems() {
		const page = this.rankList.find(
			(page) => page.id === this.selectedPageId
		)
		return page?.list ?? []
	}

	resetRankList() {
		const emptyRankList: Page[] = [
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
		this.rankList = JSON.parse(JSON.stringify(emptyRankList))
	}

	setupRankListFromDto(dto: ListDto | undefined) {
		if (!dto) {
			this.resetRankList()
			return
		}

		this.rankList.forEach((page) => {
			page.list = dto[page.id] ?? []
		})
	}

	private savePageToDb(pageId: PageId, items: Item[]) {
		this.firebase.savePageToDb(
			this.userId,
			this.selectedList,
			pageId,
			items
		)
	}

	addNewItem(item: Item) {
		this.selectedPageItems.push(item)
		this.selectedPageItems.sort((a, b) => a.name.localeCompare(b.name))
		this.savePageToDb(this.selectedPageId, this.selectedPageItems)
	}

	edit(targetPageId: PageId, prevItemIndex: number, item: Item) {
		const page = this.rankList.find((page) => page.id === targetPageId)
		if (!page) return
		page.list[prevItemIndex] = item
		page.list.sort((a, b) => a.name.localeCompare(b.name))
		this.savePageToDb(targetPageId, page.list)
	}

	delete(itemIndex: number) {
		this.selectedPageItems.splice(itemIndex, 1)
		this.savePageToDb(this.selectedPageId, this.selectedPageItems)
	}

	sendTo(targetPageId: PageId, selectedItemIndex: number) {
		const targetPage = this.rankList.find(
			(page) => page.id === targetPageId
		)
		const targetPageItems = targetPage?.list ?? []

		targetPageItems.push(this.selectedPageItems[selectedItemIndex])
		targetPageItems.sort((a, b) => a.name.localeCompare(b.name))
		this.savePageToDb(targetPageId, targetPageItems)
		this.delete(selectedItemIndex)
	}
}
