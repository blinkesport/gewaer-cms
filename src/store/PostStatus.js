const state = {
    data: [],
    statusIds: {}
}

const mutations = {
    SET_DATA(state, data) {
        state.data = data;
    },
    SET_STATUS_IDS(state, statusList) {
        statusList.forEach(item => {
            state.statusIds[item.title.toUpperCase()] = item.id
        });
    }
}

const actions = {
    getData() {
        return axios({ url: "/posts-status" });
    },
    updateData({ commit, dispatch }) {
        return new Promise((resolve) => {
            dispatch("getData").then(({ data: postStatus }) => {
                commit("SET_STATUS_IDS", postStatus);
                commit("SET_DATA", postStatus);
            }).finally(() => resolve());
        });
    }
}

const getters = {
    statusIds(state) {
        return state.statusIds;
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
