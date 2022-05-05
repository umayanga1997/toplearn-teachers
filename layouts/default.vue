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
  data() {
    return {
      drawer: false,
      items: [
        {
          icon: "mdi-apps",
          title: "Home",
          to: "/",
        },
        {
          icon: "mdi-numeric",
          title: "Grades",
          to: "/grades",
        },
        {
          icon: "mdi-file-table",
          title: "Subjects",
          to: "/subjects",
        },
        {
          icon: "mdi-apache-kafka",
          title: "Topics",
          to: "/topics",
        },
        {
          icon: "mdi-video-box",
          title: "Videos",
          to: "/videos",
        },
        {
          icon: "mdi-note-multiple",
          title: "Tests",
          to: "/tests",
        },
        {
          icon: "mdi-video-vintage",
          title: "Live Class",
          to: "/live_class",
        },
        {
          icon: "mdi-account-multiple",
          title: "Teachers",
          to: "/users/teachers",
        },
        {
          icon: "mdi-account-group",
          title: "Students",
          to: "/users/students",
        },
      ],
    };
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
};
</script>


