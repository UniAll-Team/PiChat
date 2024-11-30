import z from 'zod'

export const passwordSchema = z.string()
	.min(8)
	.max(20)
	.refine((password) => /[A-Z]/.test(password), {
		message: 'Password must contain at least one uppercase letter',
	})
	.refine((password) => /[a-z]/.test(password), {
		message: 'Password must contain at least one lowercase letter',
	})
	.refine((password) => /[\d!@#$%^&*]/.test(password), { message: 'Password must contain at least one number or special character' })
