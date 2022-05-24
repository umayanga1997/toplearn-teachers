<template>
  <div>
    <loading-compo v-if="loading" />
    <v-col v-else cols="12">
      <v-row
        justify="center"
        align="start"
        align-content="start"
        class="ma-0 pa-0"
      >
        <dashoard-card
          headline="Videos"
          :title="'S.Count : ' + count_of_videos_sale"
          :subtitle="'S.Amount : ' + amount_of_videos_sale.toFixed(2)"
          :head_color="'yellow--text'"
          :title_color="'white--text'"
          :subtitle_color="'white--text'"
          :bg_color="'blue darken-3'"
        ></dashoard-card>
        <dashoard-card
          headline="Tests"
          :title="'S.Count : ' + count_of_tests_sale"
          :subtitle="'S.Amount : ' + amount_of_tests_sale.toFixed(2)"
          :head_color="'yellow--text'"
          :title_color="'white--text'"
          :subtitle_color="'white--text'"
          :bg_color="'purple darken-3'"
        ></dashoard-card>
        <dashoard-card
          headline="Live Classes"
          :title="'S.Count : ' + count_of_live_class_enrolment"
          :subtitle="'S.Amount : ' + amount_of_live_class_enrolment.toFixed(2)"
          :head_color="'yellow--text'"
          :title_color="'white--text'"
          :subtitle_color="'white--text'"
          :bg_color="'deep-purple darken-3'"
        ></dashoard-card>
        <dashoard-card
          headline="Total of Income"
          :title="'Amount : ' + total_income.toFixed(2)"
          :head_color="'yellow--text'"
          :title_color="'white--text'"
          :subtitle_color="'white--text'"
          :bg_color="'teal darken-3'"
        ></dashoard-card>
      </v-row>
      <br />
      <v-card elevation="4">
        <v-card-title class="orange--text">
          Transaction - Sold Items <v-spacer> </v-spacer>
          <v-col class="pa-0 ma-0" cols="12" lg="4" md="5" xl="4" sm="12">
            <v-text-field
              v-model="search"
              label="Search"
              dense
              outlined
              clearable
            ></v-text-field>
          </v-col>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="items"
          :search="search"
          sort-by="sold_date"
        >
          <template v-slot:item.sold_date="{ item }">
            <span>{{ dateTimeFormater(item.sold_date) }}</span>
          </template>
          <template v-slot:item.exp_date="{ item }">
            <span>{{
              item.exp_date != "" ? dateTimeFormater(item.exp_date) : ""
            }}</span>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </div>
</template>

<script>
var teachersRef;

export default {
  name: "dashboard_screen",
  data() {
    return {
      loading: false,
      search: "",
      count_of_videos_sale: 0,
      amount_of_videos_sale: 0,
      count_of_tests_sale: 0,
      amount_of_tests_sale: 0,
      count_of_live_class_enrolment: 0,
      amount_of_live_class_enrolment: 0,
      total_income: 0,
      headers: [
        // {
        //   text: "Item ID",
        //   value: "id",
        //   align: "start",
        //   sortable: false,
        //   width: 100,
        // },
        { text: "Item Type", value: "type" },
        {
          text: "Student ID",
          align: "start",
          sortable: false,
          value: "student_id",
        },
        { text: "Student Name", value: "student_name" },
        { text: "Price", value: "price" },
        { text: "Transaction ID", value: "transaction_id" },
        { text: "Sold Date", value: "sold_date" },
        { text: "Expire Date", value: "exp_date" },
      ],
      items: [],
    };
  },
  created() {
    teachersRef = this.$fire.firestore.collection("teachers");
    this.initialize();
  },

  methods: {
    async initialize() {
      try {
        this.loading = true;
        await this.$fire.auth.onAuthStateChanged(async (user) => {
          if (user) {
            teachersRef
              .doc(user.uid)
              .onSnapshot(
                { includeMetadataChanges: true },
                async (snapshot) => {
                  this.items = [];
                  await snapshot.ref
                    .collection("sold_videos")
                    .get()
                    .then((querySnapshot) => {
                      querySnapshot.docs?.forEach((element) => {
                        this.count_of_videos_sale += 1;
                        this.amount_of_videos_sale +=
                          element.data()["price"] ?? 0;
                        this.items.push(element.data());
                      });
                    });
                  await snapshot.ref
                    .collection("sold_tests")
                    .get()
                    .then((querySnapshot) => {
                      querySnapshot.docs?.forEach((element) => {
                        this.count_of_tests_sale += 1;
                        this.amount_of_tests_sale +=
                          element.data()["price"] ?? 0;
                        this.items.push(element.data());
                      });
                    });
                  await snapshot.ref
                    .collection("sold_live_classes")
                    .get()
                    .then((querySnapshot) => {
                      querySnapshot.docs?.forEach((element) => {
                        this.count_of_live_class_enrolment += 1;
                        this.amount_of_live_class_enrolment +=
                          element.data()["price"] ?? 0;
                        this.items.push(element.data());
                      });
                    });
                  // Calculate full amount
                  this.total_income =
                    this.amount_of_videos_sale +
                    this.amount_of_tests_sale +
                    this.amount_of_live_class_enrolment;
                  //
                  this.loading = false;
                }
              );
          }
        });
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss">
</style>