import type { Button } from '#ui/types'
import type { Provider } from '@supabase/supabase-js'

export type ClickableButton = Button & { click?: (...args: any[]) => void }

export type ProviderButton = ClickableButton & { provider: Provider }
