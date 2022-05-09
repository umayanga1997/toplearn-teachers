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
  },
});
