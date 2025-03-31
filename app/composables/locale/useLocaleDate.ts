import { format, parseISO } from 'date-fns'
import { ar, de, enUS, zhCN } from 'date-fns/locale'

export function useLocaleDate(formatString: string = 'PPPP') {
	const { locale } = useI18n()
	const localeMap = {
		en: enUS,
		'zh-Hans': zhCN,
		ar: ar,
		de: de,
	}

	return (date: any, fmtString = formatString) => {
		// 根据不同类型的日期数据，使用不同的解析方式
		switch (typeof date) {
		case 'string':
			date = parseISO(date)
			break
		case 'number':
			date = new Date(date)
			break
		}

		return format(date, fmtString, { locale: localeMap[locale.value] })
	}
}
