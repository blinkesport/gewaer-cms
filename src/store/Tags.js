const state = {
    data: []
}

const mutations = {
    SET_DATA(state, data) {
        state.data = data;
    }
}

const actions = {
    getData() {
        return axios({ url: "/tags" });
    },
    setToken({ commit }, token) {
        commit("SET_TOKEN", token);
    },
    updateData({ commit, dispatch }) {
        return new Promise((resolve) => {
            dispatch("getData").then(({ data: tags }) => {
                commit("SET_DATA", tags);
            }).finally(() => resolve());
        });
    }
}

const getters = {

}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
