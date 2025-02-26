import * as math from 'mathjs'

export const voyageLimit = {
	maxPixels: math.round(16e6),
	maxBytes: math.unit('20MiB').toNumber('B'),
}
