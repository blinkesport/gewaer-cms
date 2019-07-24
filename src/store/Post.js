import axios from "axios";
const slugify = require("@sindresorhus/slugify");

const state = {
    data: {
        title: "",
        slug: "",
        summary: "",
        content: "",
        category: "",
        post_type: "",
        tags: [],
        media_url: "",
        files: [],
        // status box
        status: 1,
        published_at: null,
        premium: 0,
        featured: 0
    }
}

const mutations = {
    SET_POST(state, post) {
        state.data = post;
    },
    SET_TITLE(state, title) {
        state.data.title = title;
    },
    SET_SLUG(state, slug) {
        state.data.slug = slug;
    },
    SET_SUMMARY(state, summary) {
        state.data.summary = summary;
    },
    SET_CONTENT(state, content) {
        state.data.content = content;
    },
    SET_CATEGORY(state, category) {
        state.data.category = category;
    },
    SET_POST_TYPE(state, type) {
        state.data.post_type = type;
    },
    SET_POST_TAGS(state, tags) {
        state.data.tags = tags;
    },
    SET_MEDIA_URL(state, url) {
        state.data.media_url = url;
    },
    SET_FILES(state, files) {
        state.data.files = files;
    },
    SET_PUBLISHED_STATUS(state, status) {
        state.data.status = status;
    },
    SET_PUBLISHED_AT(state, publishedDate) {
        state.data.published_at = publishedDate;
    },
    SET_PREMIUM_STATUS(state, premiumStatus) {
        state.data.premium = premiumStatus;
    },
    SET_FEATURED_STATUS(state, featuredStatus) {
        state.data.featured = featuredStatus;
    }
}

const actions = {
    // TODO: rename to update data
    updateData({ commit, dispatch }, id) {
        dispatch("Tags/updateData", null, { root: true });
        dispatch("getData", id).then(({ data: post }) => {
            commit("SET_POST", post);
        });
    },
    // TODO: rename to get data
    getData(_, id) {
        return axios({ url: `/posts/${id}` });
    },
    saveSluggedTitle({ commit }, title) {
        const slugifiedTitle = slugify(title);
        commit("SET_SLUG", slugifiedTitle);
    },
    cleanUp({ commit }) {
        const data = {
            title: "",
            slug: "",
            summary: "",
            content: "",
            category: "",
            post_type: "",
            tags: [],
            media_url: "",
            files: [],
            // status box
            status: 1,
            published_at: null,
            premium: 0,
            featured: 0
        }
        commit("SET_POST", data);
    }

}

const getters = {
    isScheduled(state) {
        const SCHEDULE_STATUS_ID = 2;
        return Number(state.data.status) === SCHEDULE_STATUS_ID;
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
