<template>
  <v-col cols="12" lg="3" md="4" sm="12" class="ma-0 pa-0">
    <v-card>
      <div class="anti-main">
        <iframe
          :src="item.video_link"
          width="100%"
          height="auto"
          allow="autoplay"
          allowfullscreen="true"
          webkitallowfullscreen="true"
          mozallowfullscreen="true"
        ></iframe>
        <div class="anti"></div>
      </div>

      <v-card-title> {{ item.topic }} </v-card-title>

      <v-card-subtitle> {{ item.description }} </v-card-subtitle>
      <v-container class="download-class">
        <a :href="item.note_link" download>
          <v-icon>mdi-download</v-icon> <span>Note</span>
        </a>

        <a class="ml-5" :href="item.summary_link" download
          ><v-icon>mdi-download</v-icon><span>Summary</span>
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

<style lang="scss">
.anti-main {
  position: relative;
  & .anti {
    position: absolute;
    top: 2px;
    right: 2px;
    z-index: 2;
    height: 80px;
    width: 80px;
    background: transparent;
  }
}
.download-class {
  & a {
    color: lightgreen;
    text-decoration: none;
    & i {
      color: lightgreen !important;
      padding-right: 2px;
    }
  }
}
</style>