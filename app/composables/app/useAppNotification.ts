export function useAppNotification(globalOptions?: NotificationOptions) {
	const { locale } = useI18n()

	globalOptions ??= {}
	globalOptions = {
		icon: '/favicon.ico',
		lang: locale.value,
		...globalOptions,
	}

	Notification.requestPermission()

	function newNotification(title: string, options?: NotificationOptions) {
		options = {
			...globalOptions,
			...options,
		}

		return new Notification(title, options)
	}

	return newNotification
}
