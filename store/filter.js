export const state = () => ({
  filterValue: null,
});

export const mutations = {
  filter(state, payload) {
    state.filterValue = payload;
  },
};
export const actions = {};
export const getters = {
  filterValue: (state) => {
    return state.filterValue;
  },
};
