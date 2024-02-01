import { Rank } from 'stores/FirebaseStore'
import { z } from 'zod'

export const itemSchema = z.object({
	name: z.string().min(1),
	progress: z.string(),
	rank: z.string().min(1),
})

export type ItemFormData = z.infer<typeof itemSchema> & { rank: Rank }
