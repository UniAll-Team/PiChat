import { format, parseISO } from 'date-fns'
import { de, enUS, es, fr, ja, ko, zhCN } from 'date-fns/locale'

const locales = { enUS, zhCN, ja, ko, de, fr, es }

function date2string(date: Date, localeCode: string) {
	const locale = locales[localeCode] ?? enUS
	return format(date, 'PPPP', { locale })
}

export function formatISODate(dateString: string, localeCode = 'enUS') {
	// 解析 ISO 格式的日期字符串
	const date = parseISO(dateString)

	return date2string(date, localeCode)
}

export function formatUnixDate(timestamp: number, localeCode = 'enUS') {
	// 解析 Unix 时间戳
	const date = new Date(timestamp)

	return date2string(date, localeCode)
}
