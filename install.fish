pnpm add \
    pinia-plugin-persistedstate \
    type-fest \
    date-fns \
    zod

pnpm add -D \
    sass \
    nuxt-chatgpt

set modules \
    nuxt-zod-i18n \
    i18n \
    pinia \
    @vite-pwa/nuxt \
    supabase

for module in $modules
    http_proxy npx nuxi module add $module
end
