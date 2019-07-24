import axios from "axios";

const state = {
    // data: {
    //     title: "",
    //     slug: "",
    //     summary: "",
    //     content: "",
    //     category: "",
    //     post_type: "",
    //     tags: [],
    //     media_url: "",
    //     files: [],
    //     // status box
    //     status: 1,
    //     published_at: null,
    //     premium: 0,
    //     featured: 0
    // },

    data: {
        "id": 0,
        "users_id": [],
        "sites_id": [],
        "companies_id": "",
        "post_types_id": "",
        "category_id": 0,
        "title": "", 
        "slug": "",
        "summary": "",
        "content": "",
        "media_url":"",
        "likes_count": 0,
        "post_parent_id": 0,
        "shares_count": 0,
        "views_count": 0,
        "comment_count": 0,
        "status": "",
        "comment_status": "",
        "is_published": "",
        "featured": "",
        "weight": 0,
        "premium": "",
        "published_at": "",
        "created_at": "",
        "updated_at": "",
        "is_deleted": ""
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
    // TODO: rename to CATEGORY_ID
    SET_CATEGORY(state, category) {
        state.data.category_id = category;
    },
    // TODO: rename to POST_TYPES_ID
    SET_POST_TYPE(state, type) {
        state.data.post_types_id = type;
    },
    SET_POST_TAGS(state, tags) {
        state.data.tags = tags;
    },
    SET_MEDIA_URL(state, url) {
        state.data.url = url;
    },
    SET_FILES(state, files) {
        state.data.files = files;
    },
    SET_STATUS(state, status) {
        stat.data.status = status;
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
    updateCurrent({ commit, dispatch }, id) {
        dispatch("getPost", id).then(({ data: post }) => {
            // TODO: wait until backend sends this
            commit("SET_POST", post);
        })
    },
    getPost(_, id) {
        return axios({ url: `/posts/${id}?relationships=postsTags,postsTypes` });
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
