<template>
  <div>
    <!-- Tool Bar -->
    <v-app-bar dark dense fixed app>
      <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon> -->
      <v-toolbar-title class="orange--text"
        >Exam Studio -
        <span class="white--text">{{
          this.$route.query.topic
        }}</span></v-toolbar-title
      >
    </v-app-bar>

    <loading v-if="loading" />
    <v-row v-else justify="center" class="ma-0 pa-0" dense>
      <exam-card
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
                  :items="['Single Answer', 'Multiple Answer', 'Upload Answer']"
                  v-model="editedItem.question_type"
                  label="Question Type"
                  dense
                  outlined
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="editedItem.question"
                  label="Question"
                  dense
                  outlined
                  class="text-area-max-height"
                  height="110"
                  no-resize
                ></v-textarea>
              </v-col>

              <v-col
                v-if="editedItem.question_type != 'Upload Answer'"
                cols="12"
              >
                <v-textarea
                  v-model="editedItem.answers"
                  label="Answers"
                  dense
                  outlined
                  class="text-area-max-height"
                  height="110"
                  no-resize
                ></v-textarea>
              </v-col>
              <v-col
                v-if="editedItem.question_type != 'Upload Answer'"
                cols="12"
              >
                <v-textarea
                  v-model="editedItem.currect_answers"
                  label="Currect Answer(s)"
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
var testID;

export default {
  name: "ex_studio_screen",
  data: () => ({
    dialog: false,
    dialogType: "a",
    loading: false,
    btnLoading: false,
    search: "",
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
    testID = this.$route.query.id;
    testsRef = this.$fire.firestore.collection("tests");
    this.initialize();
  },

  methods: {
    initialize() {
      try {
        this.loading = true;
        testsRef
          .doc(testID)
          .collection("questions")
          .onSnapshot((querySnapshot) => {
            this.items = [];
            querySnapshot.docs.forEach((doc) => {
              this.items.push(doc.data());
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
        if (
          this.editedItem.question_type == null ||
          this.editedItem.question_type == ""
        ) {
          this.$store.dispatch("alertState/message", [
            "Please select Type of Question",
            "error",
          ]);
        } else if (
          this.editedItem.question == null ||
          this.editedItem.question == ""
        ) {
          this.$store.dispatch("alertState/message", [
            "Please enter Question",
            "error",
          ]);
        } else if (
          (this.editedItem.question_type != "Upload Answer" &&
            this.editedItem.answers == null) ||
          this.editedItem.answers == ""
        ) {
          this.$store.dispatch("alertState/message", [
            "Please enter Answer(s)",
            "error",
          ]);
        } else if (
          (this.editedItem.question_type != "Upload Answer" &&
            this.editedItem.currect_answers == null) ||
          this.editedItem.currect_answers == ""
        ) {
          this.$store.dispatch("alertState/message", [
            "Please enter Currect Answer(s)",
            "error",
          ]);
        } else {
          this.btnLoading = true;
          var id = uuid();

          testsRef
            .doc(testID)
            .collection("questions")
            .doc(id)
            .set({
              id: id,
              test_id: testID,
              question_type: this.editedItem?.question_type,
              question: this.editedItem?.question,
              answers: this.editedItem.answers ?? null,
              currect_answers: this.editedItem.currect_answers ?? null,
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
          this.editedItem.question == null ||
          this.editedItem.question == ""
        ) {
          this.$store.dispatch("alertState/message", [
            "Please enter Question",
            "error",
          ]);
        } else if (
          (this.editedItem.question_type != "Upload Answer" &&
            this.editedItem.answers == null) ||
          this.editedItem.answers == ""
        ) {
          this.$store.dispatch("alertState/message", [
            "Please enter Answer(s)",
            "error",
          ]);
        } else if (
          (this.editedItem.question_type != "Upload Answer" &&
            this.editedItem.currect_answers == null) ||
          this.editedItem.currect_answers == ""
        ) {
          this.$store.dispatch("alertState/message", [
            "Please enter Currect Answer(s)",
            "error",
          ]);
        } else {
          this.btnLoading = true;

          testsRef
            .doc(testID)
            .collection("questions")
            .doc(this.editedItem.id)
            .update({
              // test_id: testID,
              question_type: this.editedItem?.question_type,
              question: this.editedItem?.question,
              answers: this.editedItem.answers ?? null,
              currect_answers: this.editedItem.currect_answers ?? null,
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
          .doc(testID)
          .collection("questions")
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

<style lang="scss">
// .topic-color {
//   color: rgb(154, 255, 221) !important;
// }
</style>