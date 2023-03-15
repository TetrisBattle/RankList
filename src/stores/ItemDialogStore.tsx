import { Item, PageId } from 'types'
import { makeAutoObservable } from 'mobx'
import ListStore from './ListStore'
import RootStore from './RootStore'

type DialogType = 'new' | 'edit'

export default class ItemDialogStore {
	private listStore: ListStore
	private selectedItemIndex = 0
	item = { name: '', progress: '' }
	targetPageId: PageId = 'unknown'
	dialogOpen = false
	dialogType: DialogType = 'new'
	errorText = ''

	constructor(rootStore: RootStore) {
		this.listStore = rootStore.listStore
		makeAutoObservable(this)
	}

	setItem(item: Item) {
		this.item = item
	}

	setSelectedItemIndex(selectedItemIndex: number) {
		this.selectedItemIndex = selectedItemIndex
	}

	setTargetPageId(targetPageId: PageId) {
		this.targetPageId = targetPageId
	}

	setDialogType(value: DialogType) {
		this.dialogType = value
	}

	setErrorText(value: string) {
		this.errorText = value
	}

	setDialogOpen(dialogOpen: boolean) {
		this.dialogOpen = dialogOpen
	}

	private itemExists(itemName: string) {
		let exists = false

		this.listStore.rankList.forEach((page) => {
			const foundItemIndex = page.list.findIndex(
				(item) => item.name.toLowerCase() === itemName.toLowerCase()
			)
			if (foundItemIndex === -1) return

			exists = true
			this.errorText = `Item already exists in page ${page.label} at number ${
				foundItemIndex + 1
			}`
		})

		return exists
	}

	dialogSave() {
		const item = {
			name: this.item.name.trim(),
			progress: this.item.progress.trim(),
		}
		if (!item.name) {
			this.errorText = "Name can't be empty"
			return
		}

		if (this.itemExists(item.name)) return

		if (this.dialogType === 'new') {
			this.listStore.addNewItem(item)
		} else if (this.dialogType === 'edit') {
			const prevItem = this.listStore.selectedPageItems[this.selectedItemIndex]
			const isEdited = item.name.toLowerCase() !== prevItem.name.toLowerCase()
			if (isEdited) {
				this.listStore.edit(this.targetPageId, this.selectedItemIndex, item)
			}
		}
		this.dialogOpen = false
	}
}
