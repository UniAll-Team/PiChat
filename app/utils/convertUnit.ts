import * as math from 'mathjs'

export function convertB2GB(value: number | string, toString = false) {
	// 根据类型构造Unit对象
	const unit = newByteUnit(value)

	// 返回结果
	return toString ? unit.to('GB').format({
		notation: 'fixed',
		precision: 2
	}) : unit.toNumber('GB')
}

function newByteUnit(value: number | string) {
	// 根据类型构造Unit对象
	if (typeof value === 'string') {
		return math.unit(value)
	} else {
		return math.unit(value, 'B')
	}
}
