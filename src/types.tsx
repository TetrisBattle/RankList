export class Item {
	constructor(public name = '', public progress = '') {}
}

export type ListOption = 'MangaList' | 'Series' | 'Movies'

export type ListDto = {
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

export type PageId =
	| 'rankS'
	| 'rankA'
	| 'rankB'
	| 'rankC'
	| 'rankD'
	| 'rankE'
	| 'rankF'
	| 'special'
	| 'unknown'

export type Page = {
	id: PageId
	label: string
	list: Item[]
}
