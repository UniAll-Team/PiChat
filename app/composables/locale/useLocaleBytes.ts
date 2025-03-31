import prettyBytes from 'pretty-bytes'

export function useLocaleBytes() {
	const { locale } = useI18n()
	const localeMap = {
		en: 'en-US',
		'zh-Hans': 'zh-Hans',
		ar: 'ar-SA',
		de: 'de-DE',
	}

	return (bytes: number) => {
		return prettyBytes(bytes, { locale: localeMap[locale.value] })
	}
}
