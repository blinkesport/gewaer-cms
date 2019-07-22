<template>
    <form class="resource-form" @submit.prevent="">
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
                            v-model="title"
                            class="form-control"
                            type="text"
                            data-vv-name="title"
                            data-vv-validate-on="blur"
                        />
                    </div>
                </div>
                <div class="col">
                    <div :class="{ 'border-danger': errors.has('slug') }" class="form-group form-group-default">
                        <label :class="{'text-danger': errors.has('slug') }">
                            Slug
                            <span v-if="errors.has('slug')"> ({{ errors.first('slug') }})</span>
                        </label>
                        <input
                            v-validate="'required'"
                            v-model.trim="slug"
                            class="form-control"
                            type="text"
                            data-vv-name="slug"
                            data-vv-as="Slug"
                            data-vv-delay="250"
                        />
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
                            type="url"
                            placeholder="https://www.mordor.com"
                            pattern="https://.*" 
                            size="30"
                            v-model.trim="postMediaUrl"
                            class="form-control"
                            data-vv-name="media-url"
                            data-vv-as="Media Url"
                        />
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
                            v-model="summary"
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
                            v-model="content"
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
                            v-validate="'required'"
                            id="name"
                            v-model="category"
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
                            :exclude-option-id="$route.params.id"
                            :endpoint="postTagsEndpoint"
                            :multiselect-props="postTagsMultiselectProps"
                        />
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>
<script>


export default {
    components: {
        quillWrapper: () => import(/* webpackChunkName: "quill-wrapper" */ "@c/quill-wrapper/quill-wrapper"),
        multiselectWrapper: () => import(/* webpackChunkName: "multiselect-wrapper" */ "@c/multiselect-wrapper/multiselect-wrapper")
    },
    data() {
        return {
            title: "",
            slug: "",
            summary: "",
            content: "",

            category: "",
            categoryEndpoint: "categories",
            categoryMultiselectProps: {
                "trackBy": "id",
                "label": "name"
            },

            postType: "",
            postTypeEndpoint: "type",
            postTypeMultiselectProps: {
                "multiple": true
            },

            postTags: "",
            postTagsEndpoint: "tags",
            postTagsMultiselectProps: {
                "multiple": true
            },

            postMediaUrl: ""
        }
    },
    methods: {
        submitForm() {
            console.log("Submit!");
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
