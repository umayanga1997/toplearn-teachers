<template>
  <v-col class="main-compo" cols="12" md="4" sm="6" xl="4" lg="3">
    <v-card elevation="2" class="pa-4">
      <v-tabs v-model="tab" color="orange">
        <v-tab> Sign In </v-tab>
        <v-tab> Sign Up </v-tab>
      </v-tabs>

      <v-card-text class="center-card">
        <v-avatar size="76" class="ma-5 indigo darken-1"
          ><v-icon size="35">mdi-account</v-icon></v-avatar
        >
        <v-form ref="form" lazy-validation>
          <v-col class="pa-0 ma-0 pt-5">
            <v-text-field
              v-model="email"
              :rules="[rules.required, rules.email]"
              label="E-mail"
              solo
              dense
              outlined
              required
            ></v-text-field>
          </v-col>
          <v-col class="pa-0 ma-0">
            <v-text-field
              v-model="password"
              :rules="[rules.required, rules.mincounter, rules.maxcounter]"
              :type="isPassShow ? 'text' : 'password'"
              label="Password"
              :append-icon="
                isPassShow ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
              "
              @click:append="isPassShow = !isPassShow"
              dense
              solo
              outlined
              required
            ></v-text-field>
          </v-col>
          <v-col class="pa-0 ma-0">
            <v-select
              dense
              v-model="selectedRole"
              :rules="[rules.required]"
              :items="roles"
              hide-selected
              solo
              label="Role"
              outlined
              clearable
              required
            ></v-select>
          </v-col>
        </v-form>
      </v-card-text>
      <v-card-actions class="pb-5">
        <v-spacer></v-spacer>
        <v-btn
          @click="tab == 0 ? signIn() : signUp()"
          :loading="btnLoading"
          :disabled="btnLoading"
          class="green darken-3 ma-0 pa-4 mr-5 white--text"
          dark
          >{{ tab == 0 ? "Sign In" : "Sign Up"
          }}<template v-slot:loader>
            <span class="custom-loader">
              <v-icon>mdi-cached</v-icon>
            </span>
          </template></v-btn
        >
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script>
export default {
  name: "signin_screen",
  head: {
    title: "Users",
    // meta: [
    //   { charset: 'utf-8' },
    //   { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    //   {
    //     hid: 'description',
    //     name: 'description',
    //     content: 'my website description'
    //   }
    // ],
    // link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  layout: "auth",
  data() {
    return {
      tab: null,
      selectedRole: null,
      roles: ["Student", "Teacher"],
      email: "",
      password: "",
      isPassShow: false,
      btnLoading: false,
      rules: {
        required: (value) => !!value || "Required.",
        mincounter: (value) => value.length >= 6 || "Min 6 characters",
        maxcounter: (value) => value.length <= 15 || "Max 15 characters",
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        },
      },
    };
  },
  methods: {
    signIn() {
      try {
        this.$refs.form.validate();
        console.log("Sign In");
      } catch (error) {}
    },
    signUp() {
      try {
        this.$refs.form.validate();
        console.log("Sign Up");
      } catch (error) {}
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
</style>