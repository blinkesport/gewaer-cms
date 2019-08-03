const slugify = require("@sindresorhus/slugify");

export default {
    data() {
        return {
            resourceData: {
                id: null,
                title: "",
                slug: ""
            },
            isLoading: false
        }
    },
    computed: {
        resourceTitle: {
            get() {
                return this.resourceData.title;
            },
            set(title) {
                this.resourceData.title = title;
                this.resourceData.slug = slugify(title);
            }
        },
        resourceSlug: {
            get() {
                return this.resourceData.slug;
            },
            set(slug) {
                this.resourceData.slug = slugify(slug);
            }
        }
    },
    methods: {
        $_doesResourceExist(endpoint) {
            if (!this.resourceData.title) {
                return false;
            }

            this.isLoading = true;
            return axios({
                url: `${endpoint}?q=(title:${this.resourceData.title})`,
                method: "GET"
            }).then(({ data: resources }) => {
                if (!resources.length) {
                    return false
                }

                this.$notify({
                    text: `"${this.resourceData.title}" already exists.`,
                    type: "error"
                });
                return true;
            }).catch((error) => {
                this.$notify({
                    text: error.response.data.errors.message,
                    type: "error"
                });
                return false;
            }).finally(() => {
                this.isLoading = false;
            })
        },
        async $_sendResourceForm(endpoint) {
            const areFieldsValid = await this.$validator.validateAll();

            if (areFieldsValid) {
                this.isLoading = true;
                const categoryExists = await this.$_doesResourceExist(endpoint, this.resourceData);

                if (categoryExists) {
                    this.$emit("form-cancelled");
                    return;
                }

                axios({
                    url: endpoint,
                    method: "POST",
                    data: this.resourceData
                }).then(({ data: newlyCreatedResource }) => {
                    this.$emit("form-saved", newlyCreatedResource);
                    this.$notify({
                        text: `${newlyCreatedResource.title} was saved successfully.`,
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
            }
        }
    }
}
