export default {
    data() {
        return {
            resourceData: {
                id: null,
                title: ""
            },
            isLoading: false
        }
    },
    methods: {
        $_resourceExists(endpoint) {
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
                    text: `Category "${this.resourceData.title}" already exists.`,
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
                const categoryExists = await this.$_resourceExists(endpoint, this.resourceData);

                if (categoryExists) {
                    this.$emit("form-cancelled");
                    return;
                }

                // axios({
                //     url: endpoint,
                //     method: "POST",
                //     data: this.resourceData
                // }).then(({ data: newlyCreatedResource }) => {
                //     this.$emit("form-saved", newlyCreatedResource);
                //     this.$notify({
                //         text: "Post ${} form saved successfully.",
                //         type: "success"
                //     });
                // }).catch(error => {
                //     this.$notify({
                //         text: error.response.data.errors.message,
                //         type: "error"
                //     });
                // }).finally(() => {
                //     this.isLoading = false;
                // });
            }
        }
    }
}
