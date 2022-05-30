<template>
  <v-col cols="12" lg="4" md="4" sm="12" class="ma-0 pa-0">
    <v-card>
      <v-row align-content="center" class="ma-0 pa-0">
        <!-- <img :src="item.cover_img" class="img-object" height="auto" /> -->
        <v-img
          :src="item.cover_img"
          :lazy-src="item.cover_img"
          max-width="40%"
          max-height="auto"
          contain
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
        <v-col>
          <v-card-title class="fs-17"> {{ item.topic }} </v-card-title>

          <v-card-subtitle> {{ item.description }} </v-card-subtitle>

          <p class="pl-4 pr-3 fs-17">Rs. {{ item.price }}/=</p>

          <!-- <p class="pl-4 pr-4 mt-4 pink">Count of Sales : {{ salesCount }}</p> -->

          <v-container class="download-class">
            <a :href="item.tute_link" download target="__blank">
              <v-icon>mdi-download</v-icon> <span>Download</span>
            </a>
          </v-container>
          <v-card-actions>
            <v-btn @click="deleteF()" icon color="red lighten-3">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn @click="edit()" icon color="green darlen-3">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-card>
  </v-col>
</template>
<script>
export default {
  name: "tute-card-compo",
  props: ["item"],

  data() {
    return {
      salesCount: 0,
    };
  },
  methods: {
    edit() {
      this.$emit("editFunction");
    },
    deleteF() {
      this.$emit("deleteFunction");
    },
  },
};
</script>

<style lang="scss">
.fs-17 {
  font-size: 17px;
}
// .img-object {
//   object-fit: contain;
//   max-width: 40%;
// }
</style>
