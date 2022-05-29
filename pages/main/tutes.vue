<template>
  <div>
    <loading-compo v-if="loading" />
    <v-row v-else justify="center" class="ma-0 pa-0 card-section" dense>
      <data-not-found v-if="items.length == 0"></data-not-found>
      <tute-card
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
                  v-model="editedItem.price"
                  label="Price"
                  dense
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="editedItem.description"
                  label="Description"
                  dense
                  height="110"
                  outlined
                  class="text-area-max-height"
                  no-resize
                ></v-textarea>
              </v-col>

              <v-col cols="12" md="6" lg="6" sm="12">
                <v-file-input
                  v-model="tuteFile"
                  label="Tute"
                  outlined
                  dense
                  class="file-input"
                  height="38"
                ></v-file-input>
                <p
                  class="mt-2 green--text"
                  v-if="
                    editedItem.tute_link != null && editedItem.tute_link != ''
                  "
                >
                  Already Uploaded
                </p>
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
var storageRefTute;

export default {
  name: "tutes_screen",
  data: () => ({
    dialog: false,
    dialogType: "a",
    loading: false,
    btnLoading: false,
    tuteFile: null,
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
    userData() {
      return this.$store.getters["systemUser/userData"];
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
  },

  created() {
    videosRef = this.$fire.firestore.collection("videos");
    topicsRef = this.$fire.firestore.collection("topics");
    storageRefTute = this.$fire.storage.ref("tutes/");
    this.initialize();
  },

  methods: {
    initialize() {
      try {
        this.loading = true;
        videosRef
          .where("teacher_id", "==", this.userData?.teacher_id)
          .onSnapshot({ includeMetadataChanges: true }, (querySnapshot) => {
            this.items = [];
            this.originalItems = [];
            querySnapshot.docs.forEach((doc) => {
              this.items.push(doc.data());
              this.originalItems.push(doc.data());
            });
            // Filter Management
            if (this.filterValue != null || this.filterValue == "")
              this.items = this.filtering(this.filterValue, this.originalItems);
            this.loading = false;
          });
        topicsRef
          .where("grade", "==", this.userData?.grade)
          .where("subject", "==", this.userData?.subject)
          .onSnapshot({ includeMetadataChanges: true }, (querySnapshot) => {
            this.topicList = [];
            querySnapshot.docs.forEach((doc) => {
              this.topicList.push(doc.data()["topic"]);
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
    async saveData() {
      try {
        if (this.editedItem.topic == null || this.editedItem.topic == "") {
          this.$store.dispatch("alertState/message", [
            "Please select Topic of Subject",
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
          this.editedItem.description == null ||
          this.editedItem.description == ""
        ) {
          this.$store.dispatch("alertState/message", [
            "Please enter Description",
            "error",
          ]);
        } else if (this.tuteFile == null) {
          this.$store.dispatch("alertState/message", [
            "Please enter Note File",
            "error",
          ]);
        } else {
          this.btnLoading = true;
          var id = uuid();

          // Upload Files
          if (this.tuteFile != null) await this.uploadFiles("tutes");

          videosRef
            .doc(id)
            .set({
              id: id,
              grade_id: this.userData.grade_id,
              grade: this.userData.grade,
              subject_id: this.userData.subject_id,
              subject: this.userData.subject,
              teacher_id: this.userData.teacher_id,
              teacher_name: this.userData.name,
              medium: this.userData?.medium,
              topic: this.editedItem?.topic,
              description: this.editedItem?.description,
              price: Number(this.editedItem?.price),
              tute_link: this.editedItem?.tute_link,
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
          this.editedItem.price == null ||
          this.editedItem.price == "" ||
          Number(this.editedItem.price ?? 0) <= 0
        ) {
          this.$store.dispatch("alertState/message", [
            "Please enter Price",
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
        } else {
          this.btnLoading = true;

          // Upload Files
          if (this.tuteFile != null) await this.uploadFiles("tutes");

          videosRef
            .doc(this.editedItem.id)
            .update({
              // grade: userData.grade,
              // subject: userData.subject,
              // teacher_id: userData.teacher_id,
              teacher_name: this.userData.name,
              // medium: userData.medium,
              topic: this.editedItem?.topic,
              description: this.editedItem?.description,
              price: Number(this.editedItem?.price),
              tute_link: this.editedItem?.tute_link,
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
        videosRef
          .doc(this.editedItem.id)
          .delete()
          .then(async () => {
            if (
              // this.editedItem?.tute_link == null ||
              this.editedItem?.tute_link != ""
            )
              await this.deleteFiles(this.editedItem.tute_link);
          })
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
    async uploadFiles(fileType) {
      try {
        if (fileType === "tutes") {
          await this.deleteFiles(this.editedItem.tute_link);
          // Upload File
          var id = uuid();
          const value = await storageRefTute
            .child(`Tute_File_${id}_${this.tuteFile.name}`)
            .put(this.tuteFile);
          await value.ref.getDownloadURL().then((url) => {
            this.editedItem.tute_link = url;
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    async deleteFiles(url) {
      try {
        if (url != null && url != "") {
          // Delete File
          await this.$fire.storage
            .refFromURL(url)
            .delete()
            .catch((e) => {
              this.$store.dispatch("alertState/message", [e, "error"]);
            });
        }
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
      this.tuteFile = null;
    },
  },
};
</script>

<style lang="scss">
.file-input {
  max-height: 38px;
}
</style>