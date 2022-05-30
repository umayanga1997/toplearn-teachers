import colors from "vuetify/es5/util/colors";

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: true,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "%s - TLT",
    title: "Top Learn-Teachers",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content:
          "At Top Learn Education, we strongly believe that Education is the most powerful weapon you can use to change the world. We will support relentlessly to solve student problems related to their curriculum at a reasonable cost.",
      },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/icon.png" },
      { href: "https://vjs.zencdn.net/7.18.1/video-js.css", rel: "stylesheet" },
    ],
    script: [{ src: "https://vjs.zencdn.net/7.18.1/video.min.js" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["@/assets/scss/style.css"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [{ src: "@/plugins/helper" }],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    [
      "@nuxtjs/firebase",
      {
        config: {
          apiKey: "AIzaSyA1KDvUVlctrq2NVefxU9WTmhBwA2I9-Q8",
          authDomain: "top-learn-81d57.firebaseapp.com",
          projectId: "top-learn-81d57",
          storageBucket: "top-learn-81d57.appspot.com",
          messagingSenderId: "671523244033",
          appId: "1:671523244033:web:83f128e817299652a35800",
          measurementId: "G-T7WD4KB992",
        },
        services: {
          auth: true,
          firestore: true,
          // functions: true,
          storage: true,
          // database: true,
          messaging: true,
          // performance: true,
          analytics: true,
          // remoteConfig: true
        },
      },
    ],
  ],
  firestore: {
    // ...
    enablePersistence: {
      /**
       * Whether to synchronize the in-memory state of multiple tabs. Setting this
       * to 'true' in all open tabs enables shared access to local persistence,
       * shared execution of queries and latency-compensated local document updates
       * across all connected instances.
       *
       * To enable this mode, `synchronizeTabs:true` needs to be set globally in all
       * active tabs. If omitted or set to 'false', `enablePersistence()` will fail
       * in all but the first tab.
       */
      synchronizeTabs: true,
    },
  },
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: "/",
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
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

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
};
