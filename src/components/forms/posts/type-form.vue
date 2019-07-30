<template>
    <form
        v-if="postType.id || !isEditing"
        class="resource-form"
        novalidate
        @submit.prevent="sendPostTypeForm">
        <div class="row">
            <div class="col">
                <div :class="{ 'border-danger': errors.has('title') }" class="form-group form-group-default">
                    <label :class="{'text-danger': errors.has('title') }">
                        Title
                        <span v-if="errors.has('title')">(required)</span>
                    </label>
                    <input
                        v-validate="'required'"
                        v-model="postType.title"
                        data-vv-as="Title"
                        data-vv-name="title"
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

// import validationMixins from "@/mixins/validationMixins";

export default {
    name: "PostTypeForm",
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
            postType: {
                id: null,
                title: ""
            }
        };
    },
    created() {
        this.isEditing && this.getData();
    },
    methods: {
        getData() {
            this.isLoading = true;

            axios({
                url: `/categories/${this.$route.params.id}`,
                method: "GET"
            }).then(({ data: category }) => {
                this.category = category;
            }).catch(error => {
                this.$notify({
                    text: error.response.data.errors.message,
                    type: "error"
                });
            }).finally(() => {
                this.isLoading = false;
            });
        },
        async sendPostTypeForm() {
            const areFieldsValid = await this.$validator.validateAll();

            if (areFieldsValid) {
                this.isLoading = true;
                const url = this.isEditing ? `/posts-types/${this.$route.params.id}` : "/posts-types";
                const method = this.isEditing ? "PUT" : "POST";

                axios({
                    url,
                    method,
                    data: this.postType
                }).then(({ data: newPostType }) => {
                    this.$emit("post-type-form-saved", newPostType);
                    this.$store.dispatch("PostTypes/updateData");
                    this.$notify({
                        text: "Post type form saved successfully.",
                        type: "success"
                    });
                }).catch(error => {
                    debugger;
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
