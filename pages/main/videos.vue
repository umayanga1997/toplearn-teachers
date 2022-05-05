<template>
  <div>
    <v-row justify="center" class="ma-0 pa-0 card-section" dense>
      <video-card
        v-for="item in items"
        :key="item.id"
        :item="item"
        @editFunction="dialogAction(item, 'e')"
        @deleteFunction="dialogAction(item, 'd')"
      />
    </v-row>

    <v-dialog v-model="dialog" max-width="600px">
      <v-card v-if="dialogType != 'd'">
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" class="pa-0 ma-0 mt-3">
                <v-text-field
                  v-model="editedItem.video_link"
                  label="Video Link"
                  dense
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pa-0 ma-0">
                <v-textarea
                  v-model="editedItem.description"
                  label="Description"
                  dense
                  outlined
                  class="text-area-max-height"
                  height="110"
                  no-resize
                ></v-textarea>
              </v-col>
              <v-col cols="12" md="6" lg="6" sm="12" class="pa-0 ma-0">
                <v-combobox
                  :items="topicList"
                  v-model="editedItem.topic"
                  label="Topic"
                  dense
                  outlined
                ></v-combobox>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="btnLoading"
            color="blue darken-1"
            text
            @click="close"
          >
            Cancel
          </v-btn>
          <v-btn
            :disabled="btnLoading"
            :loading="btnLoading"
            color="blue darken-1"
            text
            @click="dialogType == 'a' ? saveData() : updateData()"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else>
        <v-card-title class="text-h5"
          >Are you sure you want to delete this item?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="btnLoading"
            color="blue darken-1"
            text
            @click="close"
            >Cancel</v-btn
          >
          <v-btn
            :disabled="btnLoading"
            :loading="btnLoading"
            color="blue darken-1"
            text
            @click="deleteData()"
            >OK</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-fab-transition>
      <v-btn
        fab
        large
        dark
        bottom
        @click="dialogAction(null, 'a')"
        fixed
        left
        class="mb-10 green darken-2"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>
  </div>
</template>

<script>
import { v4 as uuid } from "uuid";
var videosRef;
var topicsRef;

export default {
  name: "videos_screen",
  data: () => ({
    dialog: false,
    dialogType: "a",
    loading: false,
    btnLoading: false,
    search: "",
    topicList: [],
    items: [],
    editedItem: [],
    editedIndex: -1,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New" : "Edit";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    videosRef = this.$fire.firestore.collection("videos");
    topicsRef = this.$fire.firestore.collection("topics");
    this.initialize();
  },

  methods: {
    initialize() {
      try {
        this.loading = true;
        videosRef.onSnapshot((querySnapshot) => {
          this.items = [];
          querySnapshot.docs.forEach((doc) => {
            this.items.push(doc.data());
          });
          this.loading = false;
        });
        topicsRef
          .where("grade", "==", "")
          .where("subject", "==", "")
          .onSnapshot((querySnapshot) => {
            querySnapshot.docs.forEach((doc) => {
              this.topicList.push(doc.data());
            });
          });
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
    },
    dialogAction(item, type) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogType = type;
      this.dialog = true;
    },
    saveData() {
      try {
        this.btnLoading = true;
        var id = uuid();

        videosRef
          .doc(id)
          .set({
            id: id,
            grade: "",
            subject: "",
            teacher_id: "",
            medium: "",
            topic: this.editedItem?.topic,
            description: this.editedItem?.description,
            video_link: this.editedItem?.video_link,
            create_date: new Date(),
          })
          .then(() => {
            this.$store.dispatch("alertState/message", [
              "Data added successfully.",
              "success",
            ]);
            this.btnLoading = false;
          });
      } catch (error) {
        console.log(error);
        this.btnLoading = false;
      }
    },
    updateData() {
      try {
        this.btnLoading = true;
        videosRef
          .doc(this.editedItem.id)
          .update({
            topic: this.editedItem?.topic,
            video_link: this.editedItem?.video_link,
            description: this.editedItem?.description,
            last_update_date: new Date(),
          })
          .then(() => {
            this.$store.dispatch("alertState/message", [
              "Data updated successfully.",
              "success",
            ]);
            this.btnLoading = false;
          });
      } catch (error) {
        console.log(error);
      }
    },
    deleteData() {
      try {
        this.btnLoading = true;
        videosRef
          .doc(this.editedItem.id)
          .delete()
          .then(() => {
            this.$store.dispatch("alertState/message", [
              "Data deleted successfully.",
              "success",
            ]);
            this.btnLoading = false;
            this.close();
          });
      } catch (error) {
        console.log(error);
      }
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
      });
    },
  },
};
</script>

<style lang="scss">
</style>