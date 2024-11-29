import { formatWithOptions, parseISO } from 'date-fns/fp'
import { arSA, enUS, zhCN } from 'date-fns/locale'

export function useLocaleDate(formatString: string = 'PPPP') {
	const { locale } = useI18n()
	const localeMap = {
		en: enUS,
		'zh-Hans': zhCN,
		ar: arSA,
	}
	const format = formatWithOptions({ locale: localeMap[locale.value] }, formatString)

	return (date: any) => {
		// 根据不同类型的日期数据，使用不同的解析方式
		switch (typeof date) {
			case 'string':
				date = parseISO(date)
				break
			case 'number':
				date = new Date(date)
				break
		}

		return format(date)
	}
}
