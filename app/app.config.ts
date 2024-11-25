export default defineAppConfig({
	// 必须直接填写，因为客户端插件无法访问环境变量
	google: {
		clientId: '571862860524-n4ulfjogo75ace3ckb2j5g1sgehs6340.apps.googleusercontent.com'
	},
	ui: {
		primary: 'sky',
		gray: 'cool',
		button: {
			rounded: 'rounded-full',
			default: {
				size: 'md'
			}
		},
		input: {
			default: {
				size: 'md'
			}
		},
		card: {
			rounded: 'rounded-xl'
		},
		footer: {
			top: {
				wrapper: 'border-t border-gray-200 dark:border-gray-800',
				container: 'py-8 lg:py-16'
			},
			bottom: {
				wrapper: 'border-t border-gray-200 dark:border-gray-800'
			}
		},
		page: {
			hero: {
				wrapper: 'lg:py-24'
			}
		}
	}
})
