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
  </v-app>
</template>


