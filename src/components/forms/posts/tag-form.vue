<template>
    <form
        v-if="tag.id || !isEditing"
        class="resource-form"
        novalidate
        @submit.prevent="sendTag">
        <div class="row">
            <div class="col">
                <div :class="{ 'border-danger': errors.has('title') }" class="form-group form-group-default">
                    <label :class="{'text-danger': errors.has('title') }">
                        Title
                        <span v-if="errors.has('title')">(required)</span>
                    </label>
                    <input
                        v-validate="'required'"
                        v-model="tagTitle"
                        data-vv-as="Title"
                        data-vv-name="title"
                        autofocus
                        class="form-control"
                        type="text"
                    >
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div :class="{ 'border-danger': errors.has('slug') }" class="form-group form-group-default">
                    <label :class="{'text-danger': errors.has('slug') }">
                        Slug
                        <span v-if="errors.has('slug')">(required)</span>
                    </label>
                    <input
                        v-validate="'required'"
                        v-model="tagSlug"
                        data-vv-as="Slug"
                        data-vv-name="slug"
                        autofocus
                        class="form-control"
                        type="text"
                    >
                </div>
            </div>
        </div>
        <div class="row justify-content-end">
            <div class="col-auto">
                <button
                    :disabled="isLoading"
                    :title="isLoading ? 'Processing, wait a moment...' : 'Cancel'"
                    type="button"
                    class="btn btn-danger"
                    @click="cancelForm"
                >
                    Cancel
                </button>
            </div>
            <div class="col-auto">
                <button class="btn btn-primary">Save</button>
            </div>
        </div>
    </form>
</template>

<script>

const slugify = require("@sindresorhus/slugify");

// import validationMixins from "@/mixins/validationMixins";

export default {
    name: "PostTagForm",
    // mixins: [validationMixins],
    props: {
        isEditing: {
            type: Boolean,
            default: false
        },
        isFromModal: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isLoading: false,
            tag: {
                id: null,
                title: "",
                slug: ""
            }
        };
    },
    computed: {
        tagTitle: {
            get() {
                return this.tag.title;
            },
            set(title) {
                this.tag.title = title;
                this.tag.slug = slugify(title);
            }
        },
        tagSlug: {
            get() {
                return this.tag.slug;
            },
            set(slug) {
                this.tag.slug = slugify(slug);
            }
        }
    },
    created() {
        this.isEditing && this.getData();
    },
    methods: {
        getData() {
            this.isLoading = true;

            axios({
                url: `/tags/${this.$route.params.id}`,
                method: "GET"
            }).then(({ data: tag }) => {
                this.tag = tag;
            }).catch(error => {
                this.$notify({
                    text: error.response.data.errors.message,
                    type: "error"
                });
            }).finally(() => {
                this.isLoading = false;
            });
        },
        async sendTag() {
            const areFieldsValid = await this.$validator.validateAll();

            if (areFieldsValid) {
                this.isLoading = true;
                const url = this.isEditing ? `/tags/${this.$route.params.id}` : "/tags";
                const method = this.isEditing ? "PUT" : "POST";

                axios({
                    url,
                    method,
                    data: this.tag
                }).then(({ data: newPostTag }) => {
                    this.$emit("post-tag-form-saved", newPostTag);
                    this.$store.dispatch("Tags/updateData");
                    this.$notify({
                        text: "Post Tag form saved successfully.",
                        type: "success"
                    });
                }).catch(error => {
                    this.$notify({
                        text: error.response.data.errors.message,
                        type: "error"
                    });
                }).finally(() => {
                    this.isLoading = false;
                });
            } else {
                // this.$_focusOnError();
            }
        },
        cancelForm() {
            if (this.isFromModal) {
                this.$emit("form-cancelled");
                return;
            }
            // this.$router.push({ name: "browse", params: { resource: "search-terms" } })
        }
    }
}
</script>
