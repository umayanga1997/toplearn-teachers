<template>
  <v-app>
    <v-main>
      <!-- Body -->
      <v-container fluid>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer absolute app>
      <span
        >&copy; {{ new Date().getFullYear() + " Powered by Apec Lanka" }}</span
      >
    </v-footer>
    <!-- Message -->
    <v-snackbar
      v-model="isAlertShow"
      top
      shaped
      content-class="snack_content"
      centered
      :color="
        alertType == 'error'
          ? 'red darken-4'
          : alertType == 'warning'
          ? 'orange darken-4'
          : 'green darken-4'
      "
    >
      {{ message }}
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  name: "DefaultLayout",
  beforeCreate() {
    this.$fire.auth.onAuthStateChanged(async (user) => {
      if (user) {
        this.$store.commit("systemUser/findUserData");
        // This is working with already signin and cookies setted session
        if (this.$store.getters["systemUser/userData"] != null) {
          if (this.$route.path == "/user/auth")
            this.$router.replace("/").catch(() => {});
        } else {
          this.$router.replace("/user/auth").catch(() => {});
        }
      } else {
        this.$router.replace("/user/auth").catch(() => {});
      }
    });
  },
  data() {
    return {};
  },
  computed: {
    isAlertShow() {
      return this.$store.getters["alertState/isAlertShow"];
    },
    alertType() {
      return this.$store.getters["alertState/alert_type"];
    },
    message() {
      return this.$store.getters["alertState/msg"];
    },
  },
  methods: {},
};
</script>


