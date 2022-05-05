<template >
  <v-col cols="12" md="6" lg="3" sm="6" xl="2" class="ma-0 pa-0">
    <v-card @click="navigate" class="green darken-2">
      <v-row class="ma-0 pa-0" justify="space-between">
        <div>
          <v-card-title> Top western road trips </v-card-title>
          <v-card-subtitle> 1,000 miles of wonder </v-card-subtitle>
        </div>
        <v-icon class="mr-3">mdi-arrow-right</v-icon>
      </v-row>

      <!-- <v-card-actions>
        <v-btn color="orange lighten-2" text> Explore </v-btn>

        <v-spacer></v-spacer>

        <v-btn icon @click="show = !show">
          <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
        </v-btn>
      </v-card-actions> -->
    </v-card>
  </v-col>
</template>
<script>
export default {
  name: "test-card-compo",
  data() {
    return {
      show: false,
    };
  },
  methods: {
    navigate() {},
  },
};
</script>