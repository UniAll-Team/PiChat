
export type Image = {
	id: number
	alt: string
	url?: string
	srcSet?: string[]
	[other: string]: any
}

export type Images = Image[]
