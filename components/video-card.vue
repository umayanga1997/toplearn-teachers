<template>
  <v-col cols="12" lg="3" md="4" sm="12" class="ma-0 pa-0">
    <v-card>
      <!-- For use if role equels to student -->
      <!-- <v-img
        src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
        height="200px"
      ></v-img> -->

      <!-- // headers: [
    //   {
    //     text: "Id",
    //     align: "start",
    //     sortable: false,
    //     value: "id",
    //   },
    //   { text: "Grade", value: "grade" },
    //   { text: "Subject", value: "subject" },
    //   { text: "Teacher ID", value: "teacher_id" },
    //   { text: "Medium", value: "medium" },
    //   { text: "Video Link", value: "video_link" },
    //   { text: "Create Date", value: "create_date" },
    //   { text: "Last Update Date", value: "last_update_date" },
    //   { text: "Actions", value: "actions", sortable: false },
    // ], -->

      <v-card-title> {{ item.topic }} </v-card-title>

      <v-card-subtitle> {{ item.description }} </v-card-subtitle>

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