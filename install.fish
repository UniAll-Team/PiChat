ni \
    date-fns \
    zod \
    yaml \
    mathjs \
    pretty-bytes \
    type-fest \
    pinia-plugin-persistedstate \
    v3-infinite-loading \
    nanoid \
    nanoid-dictionary@beta \
    @uppy/core \
    @uppy/tus \
    @uppy/vue \
    @uppy/locales \
    @uppy/dashboard \
    @uppy/drag-drop \
    @uppy/progress-bar \
    @uppy/status-bar \
    @uppy/webcam \
    @uppy/file-input \
    vue3-google-login \
    openai \
    client-zip

ni -D \
    nuxi \
    sass-embedded \
    # nuxt-chatgpt \
    nuxt-lodash \
    nuxt-server-fn

set modules \
    i18n \
    pinia \
    @vite-pwa/nuxt \
    @nuxtjs/seo \
    nuxt-zod-i18n \
    supabase \
    sentry \
    stripe-next \
    @samk-dev/nuxt-vcalendar \
    nuxt-viewport \
    nuxt-swiper

for module in $modules
    # 必须使用npm源不能使用镜像源，否则会出现找不到模块的情况
    http_proxy pnpx nuxi module add $module
end
