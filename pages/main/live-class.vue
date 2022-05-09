<template>
  <div>
    <loading v-if="loading" />
    <v-row v-else justify="center" class="ma-0 pa-0 card-section" dense>
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
              <v-col cols="12" md="6" lg="6" sm="12">
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
              <v-col cols="12" md="6" lg="6" sm="12">
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
    userData() {
      return this.$store.getters["systemUser/userData"];
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
        liveClassRef
          .where("teacher_id", "==", this.userData?.teacher_id)
          .onSnapshot((querySnapshot) => {
            this.items = [];
            querySnapshot.docs.forEach((doc) => {
              this.items.push(doc.data());
            });
            this.loading = false;
          });
        topicsRef
          .where("grade", "==", this.userData?.grade)
          .where("subject", "==", this.userData?.subject)
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
        if (
          this.editedItem.schedule_date == null ||
          this.editedItem.schedule_date == ""
        ) {
          this.$store.dispatch("alertState/message", [
            "Please select Schedule Date",
            "error",
          ]);
        } else if (
          this.editedItem.schedule_time == null ||
          this.editedItem.schedule_time == ""
        ) {
          this.$store.dispatch("alertState/message", [
            "Please select Schedule Time",
            "error",
          ]);
        } else if (
          this.editedItem.topic == null ||
          this.editedItem.topic == ""
        ) {
          this.$store.dispatch("alertState/message", [
            "Please select Topic",
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
        } else if (this.editedItem.link == null || this.editedItem.link == "") {
          this.$store.dispatch("alertState/message", [
            "Please enter Link",
            "error",
          ]);
        } else {
          this.btnLoading = true;
          var id = uuid();

          liveClassRef
            .doc(id)
            .set({
              id: id,
              grade: this.userData.grade,
              subject: this.userData.subject,
              teacher_id: this.userData.teacher_id,
              teacher_name: this.userData.name,
              topic: this.editedItem.topic,
              price: Number(this.editedItem?.price),
              medium: this.userData.medium,
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
        }
      } catch (error) {
        console.log(error);
        this.btnLoading = false;
      }
    },
    updateData() {
      try {
        if (this.editedItem.link == null || this.editedItem.link == "") {
          this.$store.dispatch("alertState/message", [
            "Please enter Link",
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
        } else {
          this.btnLoading = true;

          liveClassRef
            .doc(this.editedItem.id)
            .update({
              // grade: userData.grade,
              // subject: userData.subject,
              // teacher_id: userData.teacher_id,
              teacher_name: this.userData.name,
              topic: this.editedItem.topic,
              price: Number(this.editedItem?.price),
              // medium: userData.medium,
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
        }
      } catch (error) {
        console.log(error);
        this.btnLoading = false;
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
        this.btnLoading = false;
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