<template>
  <v-col cols="12" md="6" lg="3" sm="6" xl="2" class="ma-0 pa-0">
    <v-card>
      <v-card-title class="pb-0 pt-2"> {{ item.topic }} </v-card-title>

      <p class="pl-4 pr-4 mt-4">Rs. {{ item.price }}/=</p>

      <v-card-actions>
        <v-btn @click="deleteF()" icon color="red lighten-3">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-btn @click="edit()" icon color="green darlen-3">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>

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
              <span class="title-text">Link</span>
              <p class="subtitle-text">{{ item.link }}</p>
            </v-col>
            <v-col class="ma-0 pa-0 pt-2">
              <span class="title-text">Date & Time</span>
              <p class="subtitle-text ma-0">{{ item.schedule_date }}</p>
              <p class="subtitle-text">{{ item.schedule_time }}</p>
            </v-col>
            <v-col class="ma-0 pa-0 pt-2">
              <span class="title-text">Teacher</span>
              <p class="subtitle-text">{{ item.teacher_name }}</p>
            </v-col>
            <!-- <v-col class="ma-0 pa-0 pt-2">
              <p class="title-text ma-0 pa-0">
                Your can request to a live class
              </p>
              <v-btn class="green darken-2 mt-2">Request </v-btn>
            </v-col> -->
          </v-card-text>
        </div>
      </v-expand-transition>
    </v-card>
  </v-col>
</template>
<script>
export default {
  name: "online-card-compo",
  props: ["item"],
  data() {
    return {
      show: false,
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
.title-text {
  font-size: 15px !important;
  color: rgb(145, 145, 145);
}
.subtitle-text {
  color: rgb(255, 255, 255);
}
</style>