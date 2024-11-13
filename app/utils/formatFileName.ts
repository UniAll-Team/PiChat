import { customAlphabet } from 'nanoid'
import { lowercase, numbers } from 'nanoid-dictionary'

export function newSafeNanoid(idLength = 10) {
	const safeAlphabet = lowercase + numbers
	return customAlphabet(safeAlphabet, idLength)
}

export function addSuffix(filename: string, suffix?: string) {
	const nanoid = newSafeNanoid(4)
	suffix = suffix ?? nanoid()

	const tokens = filename.split('.')
	tokens[0] = `${tokens[0]}_${suffix}`
	return tokens.join('.')
}
