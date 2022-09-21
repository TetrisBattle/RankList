export class Item {
	constructor(public name = '', public progress = '') {}
}

export interface ListDto {
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

export interface Page {
	id: PageId
	label: string
	list: Item[]
}
