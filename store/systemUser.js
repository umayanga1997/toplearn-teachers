import jwt from "jsonwebtoken";
import Cookies from "js-cookie";

export const state = () => ({
  userData: null,
});

export const mutations = {
  findUserData(state) {
    var token = Cookies.get("access_token");
    if (token) {
      jwt.verify(token, "systemuser", function (error, decoded) {
        if (error == null) state.userData = decoded;
      });
    }
    // state.userData = JSON.parse(localStorage.getItem("systemuser"));
  },
};
export const actions = {};
export const getters = {
  userData: (state) => {
    return state.userData;
  },
};
