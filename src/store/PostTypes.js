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
        return axios({ url: "/posts-types" });
    },
    updateData({ commit, dispatch }) {
        return new Promise((resolve) => {
            dispatch("getData").then(({ data: postTypes }) => {
                commit("SET_DATA", postTypes);
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
