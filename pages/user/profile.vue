<template>
  <v-col class="main-compo" cols="12" md="4" sm="6" xl="4" lg="3">
    <v-card elevation="2" class="pa-4">
      <p class="ma-0 f-size">Update Profile</p>
      <v-card-text class="center-card">
        <v-form ref="form" lazy-validation>
          <v-col class="pl-0 pr-0 pt-5">
            <v-text-field
              v-model="name"
              label="Name"
              solo
              dense
              outlined
              required
            ></v-text-field>
          </v-col>
          <v-row class="ma-0 pa-0 pt-3">
            <v-spacer></v-spacer>
            <v-btn
              @click="update()"
              :loading="btnLoadingUpdate"
              :disabled="btnDisable"
              class="green darken-3 ma-0 white--text"
              dark
              >Update</v-btn
            >
          </v-row>
          <br />
          <hr />

          <br />
          <v-row class="ma-0 pa-0">
            <v-spacer></v-spacer>
            <v-btn
              @click="resetPassword()"
              :loading="btnLoadingReset"
              :disabled="btnDisable"
              class="red darken-4 ma-0 white--text"
              dark
              >Reset Password</v-btn
            >
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";

var teachersRef;

export default {
  name: "profile_screen",
  head: {
    title: "Profile",
  },
  data() {
    return {
      name: "",
      email: "",
      isPassShow: false,
      btnDisable: false,
      btnLoadingReset: false,
      btnLoadingUpdate: false,
    };
  },

  created() {
    this.$store.commit("systemUser/findUserData");
    teachersRef = this.$fire.firestore.collection("teachers");
  },
  computed: {
    
  },
  watch: {
    userData(value) {
      this.name = value?.name;
      this.email = value?.email;
      // this.password = value?.password;
    },
  },
  methods: {
    async update() {
      try {
        if (this.name == null || this.name == "") {
          this.$store.dispatch("alertState/message", [
            "Please enter Name",
            "error",
          ]);
        } else {
          this.btnLoadingUpdate = true;
          this.btnDisable = true;
          await this.$fire.auth.onAuthStateChanged(async (user) => {
            if (user) {
              teachersRef
                .doc(user.uid)
                .update({
                  name: this.name,
                })
                .then(async () => {
                  await this.videosUpdate(
                    "teacher_id",
                    this.userData.teacher_id,
                    "teacher_name",
                    this.userData.teacher_name
                  );
                  await this.testsUpdate(
                    "teacher_id",
                    this.userData.teacher_id,
                    "teacher_name",
                    this.userData.teacher_name
                  );
                  await this.liveClassesUpdate(
                    "teacher_id",
                    this.userData.teacher_id,
                    "teacher_name",
                    this.userData.teacher_name
                  );
                })
                .then(async () => {
                  // Remove previos cookie
                  Cookies.remove("access_token");
                  // Create jwt token (Create a new with a new name)
                  let token = jwt.sign(
                    JSON.stringify({
                      teacher_id: this.userData.teacher_id,
                      name: this.name,
                      isAuth: true,
                      email: user.email,
                      // grade_id: this.wgData.wg_id,
                      // grade: this.wgData.wg,
                      subject_id: this.userData.subject_id,
                      subject: this.userData.subject,
                      medium: this.userData.medium,
                    }),
                    "systemuser"
                  );
                  // Token set to cookie (Reset)
                  // var in30Minutes = 1 / 48;
                  Cookies.set("access_token", token, {
                    expires: 1,
                  });
                })
                .then(() => {
                  this.$store.dispatch("alertState/message", [
                    "Profile updated successfully.",
                    "success",
                  ]);
                  this.$router.go();
                  this.btnLoadingUpdate = false;
                  this.btnDisable = false;
                })
                .catch((error) => {
                  this.$store.dispatch("alertState/message", [error, "error"]);
                  this.btnLoadingUpdate = false;
                  this.btnDisable = false;
                });
            }
          });
        }
      } catch (error) {
        console.log(error);
        this.btnLoadingUpdate = true;
        this.btnDisable = true;
      }
    },
    resetPassword() {
      try {
        if (this.$refs.form.validate()) {
          this.btnLoadingReset = true;
          this.btnDisable = true;
          this.$fire.auth
            .sendPasswordResetEmail(this.email)
            .then(() => {
              this.$store.dispatch("alertState/message", [
                "Reset Password link sent to your email address. Please check your inbox",
                "success",
              ]);
              this.btnLoadingReset = false;
              this.btnDisable = false;
            })
            .catch((error) => {
              this.$store.dispatch("alertState/message", [
                `"Reset Password error", ${error}`,
                "success",
              ]);
              this.btnLoadingReset = false;
              this.btnDisable = false;
            });
        }
      } catch (error) {
        console.log(error);
        this.btnLoadingReset = true;
        this.btnDisable = true;
      }
    },
  },
};
</script>

<style lang="scss">
.main-compo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  & .center-card {
    text-align: center;
  }
}
.f-size {
  font-size: 20px;
}
</style>