<template>
  <div>
    <!-- Tool Bar -->
    <v-app-bar dark dense fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>TOP-LEARN</v-toolbar-title>

      <v-spacer />
      <v-btn icon @click="filterDialog = !filterDialog">
        <v-icon color="orange">mdi-filter</v-icon>
      </v-btn>
      <v-btn icon @click="signOut()"
        ><v-icon class="appBar-icon">mdi-logout</v-icon></v-btn
      >

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
          <onlineclass v-else />
        </v-container>
      </v-tab-item>
    </v-tabs-items>
    <v-dialog v-model="filterDialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Filter</span>
        </v-card-title>
        <v-card-text>
          <v-row class="mt-1">
            <!-- <v-col>
              <v-select :items="items" label="Grade" dense outlined></v-select>
            </v-col> -->
            <v-col>
              <v-select
                :items="topicList"
                label="Topics"
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
          <v-btn color="green darken-2" @click="filterDialog = false">
            Filter
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import videospage from "@/pages/main/videos.vue";
import tests from "@/pages/main/tests.vue";
import onlineclass from "@/pages/main/live-class.vue";
import dashboard from "@/pages/main/dashboard.vue";
import Cookies from "js-cookie";

var topicsRef;

export default {
  name: "DefaultLayout",
  components: {
    videospage,
    tests,
    onlineclass,
    dashboard,
  },
  data() {
    return {
      tab: null,
      items: ["Dashboard", "Videos", "Tests", "Live Classes"],
      topicList: [],
      // drawerItems: [
      //   // { title: "Dashboard", icon: "mdi-view-dashboard", to: "/dashboard" },
      //   // { title: "Profile", icon: "mdi-account-circle", to: "/user/profile" },
      // ],
      topicListData: [],
      drawer: false,
      loading: false,
      show: false,
      filterDialog: false,
    };
  },
  created() {
    topicsRef = this.$fire.firestore.collection("topics");
  },
  computed: {
    userName() {
      return this.$store.getters["systemUser/userData"]?.name;
    },
    userData() {
      return this.$store.getters["systemUser/userData"];
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
    initialize() {
      try {
        this.loading = true;
        topicsRef
          .where("grade", "==", this.userData?.grade)
          .where("subject", "==", this.userData?.subject)
          .onSnapshot((querySnapshot) => {
            this.topicList = [];
            this.topicListData = [];
            querySnapshot.docs.forEach((doc) => {
              this.topicList.push(doc.data()["topic"]);
              this.topicListData.push(doc.data());
            });
            this.loading = false;
          });
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
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