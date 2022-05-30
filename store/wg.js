export const state = () => ({
  wgData: null,
});

export const mutations = {
  updateWG(state, payload) {
    state.wgData = payload;
  },
};

export const actions = {};

export const getters = {
  getWgData: (state) => {
    return state.wgData;
  },
};
