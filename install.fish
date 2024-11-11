ni \
    date-fns \
    zod \
    mathjs \
    type-fest \
    pinia-plugin-persistedstate \
    v3-infinite-loading \
    nanoid \
    nanoid-dictionary@beta \
    @uppy/core \
    @uppy/tus \
    @uppy/vue \
    @uppy/dashboard \
    @uppy/drag-drop \
    @uppy/progress-bar \
    @uppy/status-bar \
    @uppy/webcam \
    @uppy/file-input \
    openai \
    client-zip

ni -D \
    sass-embedded \
    # nuxt-chatgpt \
    nuxt-lodash \
    nuxt-server-fn

set modules \
    nuxt-zod-i18n \
    i18n \
    pinia \
    @vite-pwa/nuxt \
    supabase \
    sentry \
    stripe-next \
    @samk-dev/nuxt-vcalendar \
    nuxt-swiper

for module in $modules
    http_proxy npx nuxi module add $module
end
