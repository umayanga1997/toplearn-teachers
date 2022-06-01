import moment from "moment";
import Vue from "vue";

Vue.mixin({
  computed: {
    filterValue() {
      return this.$store.getters["filter/filterValue"];
    },
    userData() {
      return this.$store.getters["systemUser/userData"];
    },
    wgData() {
      return this.$store.getters["wg/getWgData"];
    },
  },
  methods: {
    dateTimeFormater(value) {
      var data;
      if (value != null) data = moment(value?.toDate()).format("YYYY-MM-DD");
      return data;
    },
    filtering(value, originalList) {
      try {
        var list = originalList;
        // Grade
        if (value[0] != "All" && value[0] != null)
          list = list.filter((element) => element.grade == value[0]);
        // Topic
        if (value[1] != "All" && value[1] != null)
          list = list.filter((element) => element.topic == value[1]);
        return list;
      } catch (error) {
        console.log(error);
      }
    },
    videosUpdate(search_field, search_value, update_field, update_value) {
      try {
        // Object
        var obj = {};
        obj[update_field] = update_value;

        var ref = this.$fire.firestore.collection("videos");
        ref
          .where(search_field, "==", search_value)
          .get()
          .then((querySnapshot) => {
            querySnapshot.docs?.forEach((snapshot) => {
              snapshot.ref.update(obj);
            });
          });
      } catch (error) {}
    },
    testsUpdate(search_field, search_value, update_field, update_value) {
      try {
        // Object
        var obj = {};
        obj[update_field] = update_value;

        var ref = this.$fire.firestore.collection("tests");
        ref
          .where(search_field, "==", search_value)
          .get()
          .then((querySnapshot) => {
            querySnapshot.docs?.forEach((snapshot) => {
              snapshot.ref.update(obj);
            });
          });
      } catch (error) {}
    },
    liveClassesUpdate(search_field, search_value, update_field, update_value) {
      try {
        // Object
        var obj = {};
        obj[update_field] = update_value;

        var ref = this.$fire.firestore.collection("live_classes");
        ref
          .where(search_field, "==", search_value)
          .get()
          .then((querySnapshot) => {
            querySnapshot.docs?.forEach((snapshot) => {
              snapshot.ref.update(obj);
            });
          });
      } catch (error) {}
    },
    tutesUpdate(search_field, search_value, update_field, update_value) {
      try {
        // Object
        var obj = {};
        obj[update_field] = update_value;

        var ref = this.$fire.firestore.collection("tutes");
        ref
          .where(search_field, "==", search_value)
          .get()
          .then((querySnapshot) => {
            querySnapshot.docs?.forEach((snapshot) => {
              snapshot.ref.update(obj);
            });
          });
      } catch (error) {}
    },
  },
});
