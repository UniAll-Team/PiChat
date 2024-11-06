import type { Database } from "./database"

export type Image = Database['public']['Views']['image_details']['Row'] & {
	alt: string
	url?: string
	srcSet?: string[]
}

export type Images = Image[]
