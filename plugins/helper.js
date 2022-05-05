import moment from "moment";
import Vue from "vue";

Vue.mixin({
  methods: {
    dateTimeFormater(value) {
      var data;
      if (value != null) data = moment(value?.toDate()).format("YYYY-MM-DD");
      return data;
    },
  },
});
