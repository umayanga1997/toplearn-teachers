import moment from "moment";
import Vue from "vue";

Vue.mixin({
  computed: {
    filterValue() {
      return this.$store.getters["filter/filterValue"];
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
        let list = [];
        if (value == "All") list = originalList;
        else
          list = originalList.filter((element) => element.topic == value) ?? [];
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
  },
});
