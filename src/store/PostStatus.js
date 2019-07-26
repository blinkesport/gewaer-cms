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
        return axios({ url: "/posts-status" });
    },
    updateData({ commit, dispatch }) {
        return new Promise((resolve) => {
            dispatch("getData").then(({ data: postStatus }) => {
                commit("SET_DATA", postStatus);
            }).finally(() => resolve());
        });
    }
}

const getters = {
    scheduledStatus(state) {
        return state.data.find(status => status.title === "Scheduled");
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
