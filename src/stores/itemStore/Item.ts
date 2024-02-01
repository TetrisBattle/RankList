import { ItemFormData } from 'features/itemDialog/itemValidation'
import { Timestamp } from 'firebase/firestore'
import { ItemDto, Rank } from 'stores/FirebaseStore'

export class Item {
	constructor(
		public id = '',
		public userId = '',
		public name = '',
		public progress = '',
		public rank: Rank = '?',
		public created: Date = new Date(),
		public updated: Date | null = null
	) {}

	convertToDto(): ItemDto {
		return {
			userId: this.userId,
			name: this.name,
			progress: this.progress,
			rank: this.rank,
			created: Timestamp.fromDate(this.created),
			updated: this.updated ? Timestamp.fromDate(this.updated) : null,
		}
	}

	static convertFromDto(id: string, dto: ItemDto): Item {
		return new Item(
			id,
			dto.userId,
			dto.name,
			dto.progress,
			dto.rank,
			dto.created.toDate(),
			dto.updated?.toDate() ?? null
		)
	}

	getCopyWithFormData = (itemFormData: ItemFormData): Item => {
		return new Item(
			this.id,
			this.userId,
			itemFormData.name.trim(),
			itemFormData.progress.trim(),
			itemFormData.rank,
			this.created,
			this.updated
		)
	}
}
