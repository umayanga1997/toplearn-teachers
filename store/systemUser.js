export const state = () => ({
  userData: null,
});

export const mutations = {
  findUserData(state, payload) {
    state.userData = JSON.parse(localStorage.getItem("systemuser"));
  },
};
export const actions = {};
export const getters = {
  userData: (state) => {
    return state.userData;
  },
};
