<template>
    <form
        v-if="category.id || !isEditing"
        class="resource-form"
        novalidate
        @submit.prevent="sendCategory">
        <div class="row">
            <div class="col">
                <div :class="{ 'border-danger': errors.has('title') }" class="form-group form-group-default">
                    <label :class="{'text-danger': errors.has('title') }">
                        Title
                        <span v-if="errors.has('title')">(required)</span>
                    </label>
                    <input
                        v-validate="'required'"
                        v-model="category.title"
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
                        v-model="category.slug"
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

// import validationMixins from "@/mixins/validationMixins";

export default {
    name: "PostCategoryForm",
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
            category: {
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
        async sendCategory() {
            const areFieldsValid = await this.$validator.validateAll();

            if (areFieldsValid) {
                this.isLoading = true;
                const url = this.isEditing ? `/categories/${this.$route.params.id}` : "/categories";
                const method = this.isEditing ? "PUT" : "POST";

                axios({
                    url,
                    method,
                    data: this.category
                }).then(({ data: newPostCategory }) => {
                    this.$emit("post-category-form-saved", newPostCategory);
                    this.$notify({
                        text: "Post Category form saved successfully.",
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
