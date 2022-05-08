<template >
  <v-col cols="12" md="6" lg="3" sm="6" xl="2" class="ma-0 pa-2">
    <v-card>
      <v-card-title> Q) {{ item.question }} </v-card-title>

      <v-card-subtitle>
        {{
          item.question_type == "Upload Answer"
            ? "Upload answer required"
            : item.answers
        }}
      </v-card-subtitle>

      <v-card-subtitle
        v-if="item.question_type != 'Upload Answer'"
        class="pb-0 pt-1"
        >Currect Answer</v-card-subtitle
      >
      <p v-if="item.question_type != 'Upload Answer'" class="pl-4 pr-4">
        {{ item.currect_answers }}
      </p>

      <v-card-subtitle class="pb-0 pt-1">Question Type</v-card-subtitle>
      <p class="pl-4 pr-4 pb-2">{{ item.question_type }}</p>

      <v-card-actions>
        <v-btn @click="deleteF()" icon color="red lighten-3">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-btn @click="edit()" icon color="green darlen-3">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>

        <v-spacer></v-spacer>

        <!-- <v-btn icon @click="navigate" color="orange">
          <v-icon>mdi-checkbook</v-icon>
        </v-btn> -->
      </v-card-actions>
    </v-card>
  </v-col>
</template>
<script>
export default {
  name: "exam-card-compo",
  props: ["item"],
  // data() {
  //   return {
  //     show: false,
  //   };
  // },
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