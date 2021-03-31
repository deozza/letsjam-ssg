import { NuxtConfig } from '@nuxt/types'

const config: NuxtConfig = {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Letsjam - Votre blog musical',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        hid: 'description',
        name: 'description',
        content:
          'Bienvenue sur Letsjam, le premier blog communautaire des musiciens',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        integrity:
          'sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/',
        crossorigin: 'anonymous',
        href: 'https://use.fontawesome.com/releases/v5.6.3/css/all.css',
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/css/style.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['~/plugins/provide-apollo-client.ts'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    '@nuxtjs/composition-api',
    '@nuxtjs/dotenv',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/firebase',
    '@nuxtjs/markdownit',
    '@nuxtjs/apollo',
  ],
  firebase: {
    config: {
      apiKey: process.env.FIREBASE_API_KEY ?? '',
      authDomain: 'letsjam-294614.firebaseapp.com',
      databaseURL: 'https://letsjam-294614.firebaseio.com',
      projectId: 'letsjam-294614',
      storageBucket: 'letsjam-294614.appspot.com',
      messagingSenderId: '778991514178',
      appId: '1:778991514178:web:030c587a656a69537ab3db',
      measurementId: '',
    },
    services: {
      auth: {
        persistence: 'local',
        initialize: {
          onAuthStateChangedAction: 'user/onAuthStateChangedAction',
        },
        ssr: true, // default
        // emulatorPort: 9099,
        // emulatorHost: 'http://localhost',
      },
      firestore: true,
      analytics: true,
      performance: true
    },
  },
  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint:
          'https://us-central1-letsjam-294614.cloudfunctions.net/graphql-graphql',
      },
    },
  },
  markdownit: {
    preset: 'default',
    runtime: true,
    html: true,
    breaks: false,
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'fr',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  buildDir: "../functions/.nuxt",
  build: {
    transpile: ['@vue/apollo-composable'],
    extractCSS: true
  },
}

export default config
