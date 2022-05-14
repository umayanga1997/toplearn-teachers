<template>
  <v-card class="ma-5 cardt" elevation="2" min-width="400px" :color="bg_color">
    <v-img
      :src="require('~/assets/placeholder_card.png')"
      class="align-center"
      height="130px"
      width="400px"
    >
      <v-card-title :class="head_color" class="pb-0 mb-0">
        {{ headline }}
      </v-card-title>
      <v-card-title :class="title_color"> {{ title }} </v-card-title>
      <v-card-subtitle :class="subtitle_color">
        {{ subtitle }}
      </v-card-subtitle>
    </v-img>
  </v-card>
</template>
<script>
export default {
  name: "dashboard-card-compo",
  props: [
    "headline",
    "title",
    "subtitle",
    "head_color",
    "title_color",
    "subtitle_color",
    "bg_color",
  ],
};
</script>
<style lang="scss">
.cardt {
  & .v-image__image {
    opacity: 0.5 !important;
  }
}
</style>