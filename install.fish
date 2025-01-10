set modules \
    i18n \
    pinia \
    vueuse \
    ui-pro \
    @samk-dev/nuxt-vcalendar \
    nuxt-viewport \
    scripts \
    # nuxt-swiper \
    @nuxtjs/seo \
    @vite-pwa/nuxt \
    nuxt-zod-i18n \
    supabase \
    sentry \
    webhook-validators

for module in $modules
    # 必须使用npm源不能使用镜像源，否则会出现找不到模块的情况
    http_proxy nlx nuxi module add $module
end

ni \
    date-fns \
    zod \
    yaml \
    mathjs \
    pretty-bytes \
    http-status-codes \
    # type-fest \
    @vueuse/components \
    pinia-plugin-persistedstate \
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
    @paddle/paddle-js \
    @paddle/paddle-node-sdk \
    vue3-google-login \
    ua-parser-js \
    openai \
    yn \
    client-zip

ni -D \
    nuxi \
    wrangler \
    sass-embedded \
    # nuxt-chatgpt \
    nuxt-lodash \
    nuxt-server-fn \
    vite-plugin-remove-console \
    @iconify/json
