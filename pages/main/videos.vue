<template>
  <v-row justify="center" class="ma-0 pa-0 card-section" dense>
    <video-card />
    <video-card />
    <video-card />
    <video-card />
    <video-card />
    <v-fab-transition>
      <v-btn fab large dark bottom fixed left class="mb-10 green darken-2">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>
    <v-dialog v-model="dialog"></v-dialog>
  </v-row>
</template>


<script>
// import { v4 as uuid } from "uuid";
var gradesRef;

export default {
  name: "videos_screen",
  data: () => ({
    dialog: false,
    dialogType: "a",
    loading: false,
    btnLoading: false,
    search: "",
    headers: [
      {
        text: "Id",
        align: "start",
        sortable: false,
        value: "id",
      },
      { text: "Grade", value: "grade_name" },
      { text: "Actions", value: "actions", sortable: false },
    ],
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
    gradesRef = this.$fire.firestore.collection("grades");
    this.initialize();
  },

  methods: {
    initialize() {
      try {
        this.loading = true;
        gradesRef.onSnapshot((querySnapshot) => {
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
    saveData() {
      try {
        this.btnLoading = true;
        var id = uuid();
        gradesRef
          .doc(id)
          .set({
            id: id,
            grade_name: this.editedItem.grade_name,
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
        gradesRef
          .doc(this.editedItem.id)
          .update({
            grade_name: this.editedItem.grade_name,
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
        gradesRef
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