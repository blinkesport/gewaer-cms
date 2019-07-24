<template>
    <form class="resource-form" @submit.prevent="submitForm">
        <div class="row">
            <div class="col">
                <h3 class="title">Some Title</h3>
            </div>
        </div>
        <div class="col-12 col-md">
            <div class="row">
                <div class="col">
                    <div :class="{ 'border-danger': errors.has('title') }" class="form-group form-group-default">
                        <label :class="{'text-danger': errors.has('title') }">
                            Title
                            <span v-if="errors.has('title')">(required)</span>
                        </label>
                        <input
                            v-validate="'required'"
                            v-model="postTitle"
                            class="form-control"
                            type="text"
                            data-vv-name="title"
                            data-vv-validate-on="blur"
                        >
                    </div>
                </div>
                <div class="col">
                    <div :class="{ 'border-danger': errors.has('slug') }" class="form-group form-group-default">
                        <label :class="{'text-danger': errors.has('slug') }">
                            Slug
                            <span v-if="errors.has('slug')"> (required) </span>
                        </label>
                        <input
                            v-validate="'required'"
                            v-model.trim="postSlug"
                            class="form-control"
                            type="text"
                            data-vv-name="slug"
                            data-vv-as="Slug"
                        >
                    </div>
                </div>
                <div class="col">
                    <div :class="{ 'border-danger': errors.has('media-url') }" class="form-group form-group-default">
                        <label :class="{'text-danger': errors.has('media-url') }">
                            Media Url
                            <span v-if="errors.has('media-url')"> ({{ errors.first('media-url') }})</span>
                        </label>
                        <input
                            v-validate="'required'"
                            v-model.trim="postMediaUrl"
                            type="url"
                            placeholder="https://www.mordor.com"
                            pattern="https://.*"
                            size="30"
                            class="form-control"
                            data-vv-name="media-url"
                            data-vv-as="Media Url"
                        >
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label :class="{ 'text-danger': errors.has('summary') }">
                            Summary
                            <span v-if="errors.has('summary')">(required)</span>
                        </label>
                        <quill-wrapper
                            v-validate="'required'"
                            :class="{ 'border-danger': errors.has('summary') }"
                            v-model="postSummary"
                            data-vv-name="summary"
                            name="summary"
                            data-vv-as="Body"
                        />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label :class="{ 'text-danger': errors.has('content') }">
                            Content
                            <span v-if="errors.has('content')">(required)</span>
                        </label>
                        <quill-wrapper
                            v-validate="'required'"
                            :class="{ 'border-danger': errors.has('content') }"
                            v-model="postContent"
                            data-vv-name="content"
                            name="content"
                            data-vv-as="Body"
                        />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 col-md">
                    <div class="form-group-multiselect">
                        <label :class="{'text-danger': errors.has('category') }">
                            Category
                            <span v-if="errors.has('category')">(required)</span>
                        </label>
                        <multiselect-wrapper
                            id="name"
                            v-model="postCategory"
                            :endpoint="categoryEndpoint"
                            :multiselect-props="categoryMultiselectProps"
                            :class="{'border-danger': errors.has('category')}"
                            data-vv-as="Category"
                            data-vv-name="category"
                        >
                            <!-- <template slot="beforeList" >
                                <div class="add-author-button option__desc" @click="$modal.show('category-modal', { action: 'BookInsight/updateCategory' })">
                                    <i class="fa fa-plus" />Add Category
                                </div>
                            </template> -->
                        </multiselect-wrapper>
                    </div>
                </div>
                <div class="col-12 col-md">
                    <div class="form-group-multiselect">
                        <label>
                            Type
                        </label>
                        <multiselect-wrapper
                            id="title"
                            v-model.lazy="postType"
                            :exclude-option-id="$route.params.id"
                            :endpoint="postTypeEndpoint"
                            :multiselect-props="postTypeMultiselectProps"
                        />
                    </div>
                </div>
                <div class="col-12 col-md">
                    <div class="form-group-multiselect">
                        <label>
                            Tags
                        </label>
                        <multiselect-wrapper
                            id="title"
                            v-model.lazy="postTags"
                            :endpoint="postTagsEndpoint"
                            :multiselect-props="postTagsMultiselectProps"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div class="row float-right">
            <div class="m-2">
                <button
                    :disabled="isLoading"
                    :title="isLoading ? 'Processing, wait a moment...' : 'Save'"
                    :class="{ 'deactivated': isLoading }"
                    class="btn m-1 btn-primary float-right"
                >
                    Save
                </button>
                <router-link
                    :to="{ name: 'browse', params: { resource: 'book-insights'} }"
                    :disabled="isLoading"
                    :title="isLoading ? 'Processing, wait a moment...' : 'Cancel'"
                    class="btn m-1 btn-danger float-right"
                >
                    Cancel
                </router-link>
            </div>
        </div>
    </form>
</template>
<script>
import { mapState } from "vuex";


export default {
    components: {
        quillWrapper: () => import(/* webpackChunkName: "quill-wrapper" */ "@c/quill-wrapper/quill-wrapper"),
        multiselectWrapper: () => import(/* webpackChunkName: "multiselect-wrapper" */ "@c/multiselect-wrapper/multiselect-wrapper")
    },
    data() {
        return {
            categoryEndpoint: "categories",
            categoryMultiselectProps: {
                "trackBy": "id",
                "label": "name"
            },

            postTypeEndpoint: "type",
            postTypeMultiselectProps: {
                "multiple": true
            },

            postTagsEndpoint: "tags",
            postTagsMultiselectProps: {
                "multiple": true,
                "label": "title"
            },
            postsEndpoint: "posts"
        }
    },
    computed: {
        ...mapState({
            isLoading: state => state.Application.isLoading,
            post: state => state.Post.data
        }),
        postTitle: {
            get() {
                return this.$store.state.Post.data.title;
            },
            set(title) {
                this.$store.commit("Post/SET_TITLE", title);
            }
        },
        postSlug: {
            get() {
                return this.$store.state.Post.data.slug;
            },
            set(slug) {
                this.$store.commit("Post/SET_SLUG", slug);
            }
        },
        postMediaUrl: {
            get() {
                return this.$store.state.Post.data.media_url;
            },
            set(url) {
                this.$store.commit("Post/SET_MEDIA_URL", url);
            }
        },
        postSummary: {
            get() {
                return this.$store.state.Post.data.summary;
            },
            set(summary) {
                this.$store.commit("Post/SET_SUMMARY", summary);
            }
        },
        postContent: {
            get() {
                return this.$store.state.Post.data.content;
            },
            set(content) {
                this.$store.commit("Post/SET_CONTENT", content);
            }
        },
        postCategory: {
            get() {
                return this.$store.state.Post.data.category;
            },
            set(category) {
                this.$store.commit("Post/SET_CATEGORY", category);
            }
        },
        postType: {
            get() {
                return this.$store.state.Post.data.post_type;
            },
            set(type) {
                this.$store.commit("Post/SET_POST_TYPE", type);
            }
        },
        postTags: {
            get() {
                return this.$store.state.Post.data.tags;
            },
            set(tags) {
                debugger;
                this.$store.commit("Post/SET_POST_TAGS", tags);
            }
        }
    },
    created() {
        if (this.isEditing()) {
            this.$store.dispatch("Post/updateCurrent", this.$route.params.id)
        }
    },
    methods: {
        async submitForm() {
            const isFormValid = await this.validateFields();
            if (isFormValid) {
                this.$store.commit("Application/SET_IS_LOADING", true);
                const url = this.isEditing ? `${this.postsEndpoint}/${this.$route.params.id}` : this.postsEndpoint;
                const method = this.isEditing ? "PUT" : "POST";

                axios({
                    url,
                    method,
                    data: this.post
                }).then(() => {
                    this.$notify({
                        text: "Post saved successfully",
                        type: "success"
                    });
                    this.$router.push({ name: "browse", params: { resource: "posts" } });
                }).catch(error => {
                    this.$notify({
                        text: error.response.data.errors.message,
                        type: "error"
                    });
                }).finally(() => {
                    this.$store.commit("Application/SET_IS_LOADING", false);
                });
            } else {
                // this.$_focusOnError();
            }
        },
        isEditing() {
            return this.$route.params.id;
        },
        async validateFields() {
            const isValid = this.$validator.validate();
            if (!isValid) {
                return false;
            }
            return true;
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
