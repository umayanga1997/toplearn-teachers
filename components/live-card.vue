<template>
  <v-col cols="12" md="6" lg="3" sm="6" xl="2" class="ma-0 pa-0">
    <v-card>
      <v-row justify="space-between" align="center" class="pr-5 pt-4 ma-0">
        <v-card-title class="pb-0 pt-0"> Top western road trips </v-card-title>
        <v-btn icon><v-icon color="red">mdi-delete</v-icon></v-btn>
      </v-row>

      <v-card-subtitle class="pb-0 pt-0">
        1,000 miles of wonder
      </v-card-subtitle>

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
            <v-col class="ma-0 pa-0">
              <span class="title-text">Date & Time</span>
              <p class="subtitle-text ma-0">2022-10-11</p>
              <p class="subtitle-text">01.30 PM</p>
            </v-col>
            <v-col class="ma-0 pa-0 pt-2">
              <span class="title-text">Teacher</span>
              <p class="subtitle-text">Mr.Lochana Ranasinghe</p>
            </v-col>
            <v-col class="ma-0 pa-0 pt-2">
              <p class="title-text ma-0 pa-0">
                Your can request to a live class
              </p>
              <v-btn class="green darken-2 mt-2">Request </v-btn>
            </v-col>
          </v-card-text>
        </div>
      </v-expand-transition>
    </v-card>
  </v-col>
</template>
<script>
export default {
  name: "online-card-compo",
  data() {
    return {
      show: false,
    };
  },
};
</script>
<style lang="scss">
.title-text {
  font-size: 15px !important;
  color: rgb(145, 145, 145);
}
.subtitle-text {
  color: rgb(255, 255, 255);
}
</style>