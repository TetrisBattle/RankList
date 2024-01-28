import { Timestamp } from 'firebase/firestore'
import { ItemDto, Rank } from 'stores/FirebaseStore'

export class Item {
	id = ''
	userId = ''
	rank: Rank = 'unknown'
	name = ''
	progress = ''
	created: Date = new Date()
	updated: Date | null = null

	constructor(
		id: string,
		userId: string,
		rank: Rank,
		name: string,
		progress: string,
		created: Date,
		updated: Date | null
	) {
		this.id = id
		this.userId = userId
		this.rank = rank
		this.name = name
		this.progress = progress
		this.created = created
		this.updated = updated
	}

	convertToDto(): ItemDto {
		return {
			userId: this.userId,
			rank: this.rank,
			name: this.name,
			progress: this.progress,
			created: Timestamp.fromDate(this.created),
			updated: this.updated ? Timestamp.fromDate(this.updated) : null,
		}
	}

	static convertFromDto(id: string, dto: ItemDto): Item {
		return new Item(
			id,
			dto.userId,
			dto.rank,
			dto.name,
			dto.progress,
			dto.created.toDate(),
			dto.updated?.toDate() ?? null
		)
	}
}
