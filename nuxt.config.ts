import crypto from 'crypto';
import { NuxtConfig } from '@nuxt/types';
import colors from 'vuetify/es5/util/colors';

const isProduction = process.env.NODE_ENV === 'production';

const state = crypto.randomBytes(20).toString('hex');

const loginUrl = `${process.env.COIL_API_URL?.replace(
  'api.',
  ''
)}/oauth/auth?response_type=code&client_id=${
  process.env.COIL_CLIENT_ID
}&redirect_uri=${
  process.env.COIL_REDIRECT_URI
}&state=${state}&scope=simple_wm openid email`;

const config: NuxtConfig = {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s | MG.Social',
    title: 'MG.Social',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'monetization',
        name: 'monetization',
        content: process.env.DEFAULT_PAYMENT_POINTER ?? '',
      },
      {
        hid: 'description',
        name: 'description',
        content:
          'Get paid to post! An ad-free social network with blockchain monetization powered by Coil and Xumm.',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      { src: 'https://cdn.coil.com/coil-oauth-wm.v7.beta.js', body: true },
      { src: '/matomo.js' },
      { src: '/monetization.js' },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    // '~/plugins/nuxt-query-provider',
    '~/plugins/axios',
    '~/plugins/auth-checker',
    '~/plugins/dayjs',
    '~/plugins/vue-dom-purify',
    '~/plugins/v-frag',
    '~/plugins/ignored-elements',
    '~/plugins/vue-chat-scroll',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: false,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/composition-api/module',
    '@nuxtjs/vuetify',
    'nuxt-delay-hydration',
    'nuxt-typed-vuex',
    ['unplugin-auto-import/nuxt', { imports: ['@nuxtjs/composition-api'] }],
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/axios',
    // https://github.com/microcipcip/cookie-universal
    'cookie-universal-nuxt',
  ],

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  axios: {
    proxy: true,
  },

  proxy: {
    '/api/': {
      target: process.env.MG_API_URL,
      pathRewrite: { '^/api/': '' },
      logLevel: 'debug',
      onProxyReq: (proxyReq: any) => {
        proxyReq.path += '?api_key_token=' + process.env.MG_API_TOKEN;
      },
    },
  },

  delayHydration: {
    debug: !isProduction,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // cache: true,
    extractCSS: isProduction,
    optimizeCSS: isProduction,
    extend(config) {
      config.module?.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      });
    },
  },

  serverMiddleware: [
    { path: '/api2', handler: '~/server/api/index.ts' },
    { path: '/coil/oauth', handler: '~/server/coil-oauth.ts' },
  ],

  publicRuntimeConfig: {
    loginUrl,
    mgSocialUrl: process.env?.MG_API_URL?.replace('/api/v1.0', ''),
    xrplTokens: process.env?.TOKENS?.split(','),
    devServerUrl: 'https://monegram.social',
  },

  privateRuntimeConfig: {},

  loading: false,
};

export default config;
