<template>
  <v-col class="ma-0 pa-0">
    <v-card max-width="344">
      <!-- For use if role equels to student -->
      <!-- <v-img
        src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
        height="200px"
      ></v-img> -->

      <v-card-title> Top western road trips </v-card-title>

      <v-card-subtitle> 1,000 miles of wonder </v-card-subtitle>

      <v-card-actions>
        <!-- <v-btn color="orange lighten-3" text> Explore </v-btn> -->

        <v-spacer></v-spacer>

        <v-btn icon @click="show = !show" color="green">
          <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
        </v-btn>
      </v-card-actions>

      <v-expand-transition>
        <div v-show="show">
          <v-divider></v-divider>

          <v-card-text>
            <v-row align="center" justify="space-between" class="pl-2">
              <span class="pa-0 ma-0">Video</span>
              <v-btn fab icon>
                <v-icon color="green lighten-3">mdi-upload</v-icon>
              </v-btn>
            </v-row>
            <v-row align="center" justify="space-between" class="pl-2">
              <span class="pa-0 ma-0">Note</span>
              <v-btn fab icon>
                <v-icon color="green lighten-3">mdi-upload</v-icon>
              </v-btn>
            </v-row>
            <v-row align="center" justify="space-between" class="pl-2">
              <span class="pa-0 ma-0">Summary</span>
              <v-btn fab icon>
                <v-icon color="green lighten-3">mdi-upload</v-icon>
              </v-btn>
            </v-row>
          </v-card-text>
        </div>
      </v-expand-transition>
    </v-card>
  </v-col>
</template>
<script>
export default {
  name: "video-card-compo",
  data() {
    return {
      show: false,
    };
  },
};
</script>