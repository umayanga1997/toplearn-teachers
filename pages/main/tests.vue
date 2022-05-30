<template>
  <div>
    <loading-compo v-if="loading" />
    <v-row v-else justify="center" class="ma-0 pa-0 card-section" dense>
      <data-not-found v-if="items.length == 0"></data-not-found>
      <test-card
        v-else
        v-for="item in items"
        :key="item.id"
        :item="item"
        @editFunction="dialogAction(item, 'e')"
        @deleteFunction="dialogAction(item, 'd')"
      />
    </v-row>

    <v-dialog persistent v-model="dialog" max-width="600px">
      <v-card v-if="dialogType != 'd'">
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6" lg="6" sm="12">
                <v-select
                  :items="topicList"
                  v-model="editedItem.topic"
                  label="Topic"
                  dense
                  outlined
                ></v-select>
              </v-col>
              <v-col cols="12" md="6" lg="6" sm="12">
                <v-text-field
                  v-model="editedItem.test_link"
                  label="Test Link"
                  dense
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" lg="6" sm="12">
                <v-text-field
                  v-model="editedItem.price"
                  label="Price"
                  dense
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" lg="6" sm="12">
                <v-text-field
                  v-model="editedItem.duration_hr"
                  label="Duration"
                  prefix="Hour"
                  dense
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12">
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
var testsRef;
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
    originalItems: [],
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
    // From mixin
    filterValue(value) {
      this.items = this.filtering(value, this.originalItems);
    },
    wgData() {
      this.initTpics();
    },
  },

  created() {
    testsRef = this.$fire.firestore.collection("tests");
    topicsRef = this.$fire.firestore.collection("topics");

    this.initialize();
  },

  methods: {
    initialize() {
      try {
        this.loading = true;
        testsRef
          .where("teacher_id", "==", this.userData?.teacher_id)
          .onSnapshot({ includeMetadataChanges: true }, (querySnapshot) => {
            this.items = [];
            this.originalItems = [];
            querySnapshot.docs.forEach((doc) => {
              this.items.push(doc.data());
              this.originalItems.push(doc.data());
            });
            // Filter Management
            if (this.filterValue != null && this.filterValue != "All")
              this.items = this.filtering(this.filterValue, this.originalItems);
            this.loading = false;
          });
        this.initTpics();
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
    },
    initTpics() {
      try {
        this.loading = true;
        topicsRef
          .where("grade_id", "==", this.wgData.wg_id)
          .where("subject", "==", this.userData?.subject)
          .onSnapshot({ includeMetadataChanges: true }, (querySnapshot) => {
            this.topicList = [];
            querySnapshot.docs.forEach((doc) => {
              this.topicList.push(doc.data()["topic"]);
            });
            this.loading = false;
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
    async saveData() {
      try {
        if (this.editedItem.topic == null || this.editedItem.topic == "") {
          this.$store.dispatch("alertState/message", [
            "Please select Topic of Subject",
            "error",
          ]);
        } else if (
          this.editedItem.test_link == null ||
          this.editedItem.test_link == ""
        ) {
          this.$store.dispatch("alertState/message", [
            "Please enter Test Link",
            "error",
          ]);
        } else if (
          this.editedItem.price == null ||
          this.editedItem.price == "" ||
          Number(this.editedItem.price ?? 0) <= 0
        ) {
          this.$store.dispatch("alertState/message", [
            "Please enter Price",
            "error",
          ]);
        } else if (
          this.editedItem.duration_hr == null ||
          this.editedItem.duration_hr == ""
        ) {
          this.$store.dispatch("alertState/message", [
            "Please enter Duration(hr)",
            "error",
          ]);
        } else if (
          this.editedItem.description == null ||
          this.editedItem.description == ""
        ) {
          this.$store.dispatch("alertState/message", [
            "Please enter Description",
            "error",
          ]);
        } else if (this.wgData == null) {
          this.$store.dispatch("alertState/message", [
            "Please select Working Grade.",
            "error",
          ]);
        } else {
          this.btnLoading = true;
          var id = uuid();

          testsRef
            .doc(id)
            .set({
              id: id,
              grade_id: this.wgData.wg_id,
              grade: this.wgData.wg,
              subject_id: this.userData.subject_id,
              subject: this.userData.subject,
              teacher_id: this.userData.teacher_id,
              teacher_name: this.userData.name,
              medium: this.userData.medium,
              topic: this.editedItem?.topic,
              test_link: this.editedItem?.test_link,
              price: Number(this.editedItem?.price),
              description: this.editedItem?.description,
              duration_hr: this.editedItem.duration_hr,
              create_date: new Date(),
            })
            .then(() => {
              this.$store.dispatch("alertState/message", [
                "Data added successfully.",
                "success",
              ]);
              this.clear();
              this.btnLoading = false;
            });
        }
      } catch (error) {
        console.log(error);
        this.btnLoading = false;
      }
    },
    async updateData() {
      try {
        if (
          this.editedItem.test_link == null ||
          this.editedItem.test_link == ""
        ) {
          this.$store.dispatch("alertState/message", [
            "Please enter Test Link",
            "error",
          ]);
        } else if (
          this.editedItem.price == null ||
          this.editedItem.price == "" ||
          Number(this.editedItem.price ?? 0) <= 0
        ) {
          this.$store.dispatch("alertState/message", [
            "Please enter Price",
            "error",
          ]);
        } else if (
          this.editedItem.duration_hr == null ||
          this.editedItem.duration_hr == ""
        ) {
          this.$store.dispatch("alertState/message", [
            "Please enter Duration(hr)",
            "error",
          ]);
        } else if (
          this.editedItem.description == null ||
          this.editedItem.description == ""
        ) {
          this.$store.dispatch("alertState/message", [
            "Please enter Description",
            "error",
          ]);
        } else if (this.wgData == null) {
          this.$store.dispatch("alertState/message", [
            "Please select Working Grade.",
            "error",
          ]);
        } else {
          this.btnLoading = true;

          testsRef
            .doc(this.editedItem.id)
            .update({
              grade_id: this.wgData.wg_id,
              grade: this.wgData.wg,
              teacher_name: this.userData.name,
              topic: this.editedItem?.topic,
              test_link: this.editedItem?.test_link,
              price: Number(this.editedItem?.price),
              description: this.editedItem?.description,
              duration_hr: this.editedItem.duration_hr,
              last_update_date: new Date(),
            })
            .then(() => {
              this.$store.dispatch("alertState/message", [
                "Data updated successfully.",
                "success",
              ]);
              this.clear();
              this.btnLoading = false;
            });
        }
      } catch (error) {
        console.log(error);
      }
    },
    deleteData() {
      try {
        this.btnLoading = true;
        testsRef
          .doc(this.editedItem.id)
          .collection("questions")
          .get()
          .then((querySnapshot) => {
            querySnapshot.docs?.forEach((snapshot) => {
              snapshot.ref.delete();
            });
          })
          .then(() => {
            testsRef
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
          })
          .catch((e) => {
            console.log(e);
            this.btnLoading = false;
          });
      } catch (error) {
        console.log(error);
        this.btnLoading = false;
      }
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
      });
    },
    clear() {
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
      });
      this.noteFile = null;
      this.summaryFile = null;
    },
  },
};
</script>