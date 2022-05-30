<template >
  <v-col cols="12" md="6" lg="3" sm="6" xl="2" class="ma-0 pa-0">
    <v-card>
      <v-card-title> {{ item.topic }} </v-card-title>

      <v-card-subtitle> {{ item.description }} </v-card-subtitle>

      <p class="pl-4 pr-4">Rs. {{ item.price }}/=</p>

      <!-- <p class="pl-4 pr-4 mt-4 pink">Count of Sales : {{ salesCount }}</p> -->

      <v-card-actions>
        <v-btn @click="deleteF()" icon color="red lighten-3">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-btn @click="edit()" icon color="green darlen-3">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn :href="item.test_link" color="orange darken-2" target="__blank">
          <v-icon color="black">mdi-note-edit</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
</template>
<script>
export default {
  name: "test-card-compo",
  props: ["item"],
  data() {
    return {
      salesCount: 0,
    };
  },
  methods: {
    // navigate() {
    //   this.$router.push({
    //     path: "test_studio",
    //     query: { id: this.item.id, topic: this.item.topic },
    //   });
    // },

    edit() {
      this.$emit("editFunction");
    },

    deleteF() {
      this.$emit("deleteFunction");
    },
  },
};
</script>