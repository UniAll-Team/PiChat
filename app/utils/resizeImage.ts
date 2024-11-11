export function resizeAspectRatio({ width, height }: { width: number, height: number }) {
	const maxDimension = Math.max(width, height)!
	if (maxDimension <= 1024) {
		return { width, height }
	}

	[width, height] = [width, height]
		.map(value =>
			Math.min(
				Math.round(
					value * 1024 / maxDimension
				),
				1024
			)
		)

	return { width, height }
}
