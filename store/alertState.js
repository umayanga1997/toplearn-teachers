export const state = () => ({
  isAlertShow: false,
  alert_type: null,
  message: null,
});

export const mutations = {
  setAlert(state, payload) {
    state.isAlertShow = payload[2];
    state.message = payload[0];
    state.alert_type = payload[1];
  },
};
export const actions = {
  message({ commit }, payload) {
    commit("setAlert", [payload[0], payload[1], true]);
    setTimeout(() => {
      commit("setAlert", [null, null, false]);
    }, 5000);
  },
};
export const getters = {
  isAlertShow: (state) => {
    return state.isAlertShow;
  },
  alert_type: (state) => {
    return state.alert_type;
  },
  msg: (state) => {
    return state.message;
  },
};
