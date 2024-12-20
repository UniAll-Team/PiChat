export function lookupKey2Plan(lookup_key?: string | null) {
	if (!lookup_key) {
		return {}
	}

	const [name, cycle] = lookup_key.split('/')
	return { name, cycle }
}
