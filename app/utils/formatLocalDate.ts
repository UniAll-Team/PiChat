import { format, parseISO } from 'date-fns'
import { de, enUS, es, fr, ja, ko, zhCN } from 'date-fns/locale'

const locales = { enUS, zhCN, ja, ko, de, fr, es }

export function formatLocalDate(dateString: string, localeCode = 'enUS') {
	// 解析 ISO 格式的日期字符串
	const date = parseISO(dateString)

	// 获取对应的 locale
	const locale = locales[localeCode] ?? enUS

	// 格式化日期
	return format(date, 'PPP', { locale })
}
