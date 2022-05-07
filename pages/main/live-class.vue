<template>
  <div>
    <v-row justify="center" class="ma-0 pa-0 card-section" dense>
      <live-card
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
              <v-col
                cols="12"
                md="6"
                lg="6"
                sm="12"
                class="pa-0 ma-0 pr-1 mt-3"
              >
                <v-menu
                  v-model="dateMenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="editedItem.schedule_date"
                      label="Schedule Date"
                      prepend-icon="mdi-calendar"
                      readonly
                      dense
                      outlined
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="editedItem.schedule_date"
                    @input="dateMenu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col
                cols="12"
                md="6"
                lg="6"
                sm="12"
                class="pa-0 ma-0 pl-1 mt-3"
              >
                <v-menu
                  v-model="timeMenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="editedItem.schedule_time"
                      label="Schedule Time"
                      prepend-icon="mdi-clock-time-four-outline"
                      readonly
                      dense
                      outlined
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-model="editedItem.schedule_time"
                    @input="timeMenu = false"
                  ></v-time-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="6" lg="6" sm="12" class="pa-0 ma-0">
                <v-select
                  :items="topicList"
                  v-model="editedItem.topic"
                  label="Topic"
                  dense
                  outlined
                ></v-select>
              </v-col>
              <v-col cols="12" class="pa-0 ma-0">
                <v-text-field
                  v-model="editedItem.link"
                  label="Link"
                  dense
                  outlined
                ></v-text-field>
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
            color="blue darken-1"
            :disabled="btnLoading"
            :loading="btnLoading"
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
        @click="dialogAction(null, 'a')"
        fab
        large
        dark
        bottom
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
var liveClassRef;
var topicsRef;

export default {
  name: "live_class_screen",
  data: () => ({
    dialog: false,
    dialogType: "a",
    loading: false,
    btnLoading: false,
    dateMenu: false,
    timeMenu: false,
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
    liveClassRef = this.$fire.firestore.collection("live_classes");
    topicsRef = this.$fire.firestore.collection("topics");
    this.initialize();
  },

  methods: {
    initialize() {
      try {
        this.loading = true;
        liveClassRef.onSnapshot((querySnapshot) => {
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
    saveData() {
      try {
        this.btnLoading = true;
        var id = uuid();

        liveClassRef
          .doc(id)
          .set({
            id: id,
            grade: "",
            subject: "",
            teacher_id: "",
            teacher_name: "",
            topic: this.editedItem.topic,
            medium: "",
            link: this.editedItem.link,
            schedule_date: this.editedItem.schedule_date,
            schedule_time: this.editedItem.schedule_time,
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
      }
    },
    updateData() {
      try {
        this.btnLoading = true;

        liveClassRef
          .doc(this.editedItem.id)
          .update({
            grade: "",
            subject: "",
            teacher_id: "",
            teacher_name: "",
            topic: this.editedItem.topic,
            medium: "",
            link: this.editedItem.link,
            schedule_date: this.editedItem.schedule_date,
            schedule_time: this.editedItem.schedule_time,
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
        liveClassRef
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