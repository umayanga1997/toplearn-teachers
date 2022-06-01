<template>
  <div>
    <!-- Tool Bar -->
    <v-app-bar dark dense fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>
        <img width="110" class="pt-5" src="~/assets/logo/logo-large.png" />
      </v-toolbar-title>

      <v-spacer />
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            text
            class="orange--text"
            v-bind="attrs"
            v-on="on"
            @click="wgDialog = !wgDialog"
          >
            {{
              workingGrade == null || workingGrade == "" ? "WG" : workingGrade
            }}
          </v-btn>
        </template>
        <span>Working Grade</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            icon
            @click="filterDialog = !filterDialog"
          >
            <v-icon color="orange">mdi-filter</v-icon>
          </v-btn>
        </template>
        <span>Filter</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" icon @click="signOut()"
            ><v-icon class="appBar-icon">mdi-logout</v-icon></v-btn
          ></template
        >
        <span>Sign Out</span>
      </v-tooltip>

      <template v-slot:extension>
        <v-tabs v-model="tab" centered color="orange">
          <v-tabs-slider color="yellow"></v-tabs-slider>
          <v-tab v-for="item in items" :key="item">
            {{ item }}
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <!-- Drawer -->
    <v-navigation-drawer v-model="drawer" fixed bottom temporary>
      <v-list-item :to="'/user/profile'" router>
        <v-list-item-avatar>
          <!-- <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img> -->
          <v-icon large>mdi-account-circle</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ userName }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <!-- <v-list dense>
        <v-list-item
          v-for="(item, i) in drawerItems"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-icon> </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list> -->
      <!-- <v-list nav dense>
          <v-list-item-group
            v-model="group"
            active-class="deep-purple--text text--accent-4"
          >
            <v-list-item>
              <v-list-item-title>Foo</v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Bar</v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Fizz</v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Buzz</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list> -->
    </v-navigation-drawer>
    <!-- Tabs -->
    <!-- Default Page Like Home Page -->
    <v-tabs-items v-model="tab">
      <v-tab-item
        class="tab_container"
        v-for="(item, index) in items"
        :key="item"
      >
        <v-container fluid>
          <dashboard v-if="index == 0" />
          <videospage v-else-if="index == 1" />
          <tests v-else-if="index == 2" />
          <tutes v-else />
          <!-- <onlineclass v-else /> -->
        </v-container>
      </v-tab-item>
    </v-tabs-items>
    <!-- Filter Dialog -->
    <v-dialog v-model="filterDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Filter</span>
        </v-card-title>
        <v-card-text>
          <v-row class="mt-1">
            <!-- <v-col>
              <v-select :items="items" label="Grade" dense outlined></v-select>
            </v-col> -->
            <v-col cols="12" md="6" lg="6" sm="12">
              <v-select
                :items="gradesList"
                label="Grade"
                v-model="filterGrade"
                dense
                outlined
              ></v-select>
            </v-col>
            <v-col cols="12" md="6" lg="6" sm="12">
              <v-select
                :items="topicList"
                label="Topics"
                v-model="filterTopic"
                dense
                outlined
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red lighten-1" text @click="filterDialog = false">
            Close
          </v-btn>
          <v-btn color="green darken-2" @click="filterCommit()"> Filter </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Working Grade Dialog -->
    <v-dialog v-model="wgDialog" persistent max-width="350px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Working Grade</span>
        </v-card-title>
        <v-card-text>
          <v-row class="mt-1">
            <v-col>
              <v-select
                :items="gradesListWithoutAll"
                label="Grade"
                v-model="workingGrade"
                dense
                outlined
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red lighten-1" text @click="wgDialog = false">
            Close
          </v-btn>
          <v-btn color="green darken-2" @click="saveWG()"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import videospage from "@/pages/main/videos.vue";
import tests from "@/pages/main/tests.vue";
// import onlineclass from "@/pages/main/live-class.vue";
import tutes from "@/pages/main/tutes.vue";
import dashboard from "@/pages/main/dashboard.vue";
import Cookies from "js-cookie";

var topicsRef;
var gradesRef;

export default {
  name: "home_screen",
  components: {
    videospage,
    tests,
    tutes,
    // onlineclass,
    dashboard,
  },
  data() {
    return {
      tab: null,
      filterTopic: null,
      filterGrade: null,
      items: ["Dashboard", "Videos", "Tests", "Tutes"],
      gradesList: [],
      gradesListData: [],
      gradesListWithoutAll: [],
      topicList: [],
      drawer: false,
      loading: false,
      workingGrade: "",
      filterDialog: false,
      wgDialog: false,
    };
  },
  beforeCreate() {
    this.$store.commit("systemUser/findUserData");
  },
  created() {
    gradesRef = this.$fire.firestore.collection("grades");
    topicsRef = this.$fire.firestore.collection("topics");
    this.initialize();
  },
  mounted() {
    this.openWgDialog();
  },
  computed: {
    userName() {
      return this.$store.getters["systemUser/userData"]?.name;
    },
  },
  watch: {
    wgData(value) {
      if (value != null) this.initTpics();
    },
  },
  methods: {
    async signOut() {
      try {
        await this.$fire.auth
          .signOut()
          .then(async () => {
            // localStorage.removeItem("systemuser");
            Cookies.remove("access_token");
            this.$store.dispatch("alertState/message", [
              "Sign out successfully.",
              "success",
            ]);
            // this.$router.replace("/user/auth").catch(() => {});
            // this.$router.go().catch(() => {});
            // window.history.go("/"); // Only Web
          })
          .catch((error) => {
            this.$store.dispatch("alertState/message", [error, "error"]);
          });
      } catch (error) {
        this.$store.dispatch("alertState/message", [error, "error"]);
      }
    },
    async initialize() {
      try {
        this.loading = true;
        await gradesRef.onSnapshot(
          { includeMetadataChanges: true },
          (querySnapshot) => {
            this.gradesList = [];
            this.gradesListData = [];
            this.gradesListWithoutAll = [];
            this.gradesList.push("All");
            querySnapshot.docs.forEach((doc) => {
              this.gradesList.push(doc.data()["grade"]);
              this.gradesListData.push(doc.data());
              this.gradesListWithoutAll.push(doc.data()["grade"]);
            });
            this.loading = false;
          }
        );
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
    },

    initTpics() {
      try {
        this.$store.dispatch("alertState/message", [
          "Topics are loading...",
          "success",
        ]);
        this.loading = true;
        topicsRef
          .where("grade_id", "==", this.wgData.wg_id)
          .where("subject", "==", this.userData?.subject)
          .onSnapshot({ includeMetadataChanges: true }, (querySnapshot) => {
            this.topicList = [];
            this.topicList.push("All");
            // this.topicListData = [];
            querySnapshot.docs.forEach((doc) => {
              this.topicList.push(doc.data()["topic"]);
              // this.topicListData.push(doc.data());
            });
            this.loading = false;
          });
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
    },
    openWgDialog() {
      var value = this.wData;
      if (value == null || value == "") this.wgDialog = true;
      this.workingGrade = value?.wg;
    },
    saveWG() {
      // Filter
      var filterData = this.gradesListData.find(
        (element) => element.grade == this.workingGrade
      );

      this.$store.commit("wg/updateWG", {
        wg: filterData.grade,
        wg_id: filterData.id,
      });

      this.$store.dispatch("alertState/message", [
        "Working Grade saved successfully.",
        "success",
      ]);
      this.wgDialog = false;
    },
    filterCommit() {
      this.$store.commit("filter/filter", [this.filterGrade, this.filterTopic]);
    },
  },
};
</script>

<style lang="scss">
.tab_container {
  background-color: #121212 !important;
}
.card-section {
  gap: 15px;
  white-space: normal;
  & .v-card {
    padding: 0px !important;
    margin: 0px !important;
  }
}
.v-navigation-drawer {
  max-height: 57px !important;
  position: absolute;
  background-color: green !important;
  top: 40% !important;
}
</style>