<template>
    <multiselect
        :value="value"
        :searchable="true"
        :show-labels="false"
        :options="list"
        :loading="isLoading"
        :internal-search="false"
        v-bind="mergedProps"
        class="multiselect-multiple-custom form-group-multiselect"
        @open="fetchList"
        @search-change="asyncFind"
        @input="(event) => $emit('input', event)"
    >
        <slot slot="beforeList" name="beforeList" />
        <slot slot="afterList" name="afterList" />
        <template slot="option" slot-scope="props">
            <div class="option__desc"><span class="option__title">{{ props.option[id] }}</span></div>
        </template>
    </multiselect>
</template>

<script>

export default {
    name: "CustomMultiselect",
    props: {
        value: {
            type: Object|Array|String|Number,
            required: true
        },
        id: {
            type: String,
            required: true
        },
        endpoint: {
            type: String,
            required: true
        },
        excludeOptionId: {
            type: String,
            default: ""
        },
        debounceTime: {
            type: Number,
            default: 250
        },
        multiselectProps: {
            type: Object,
            default: null
        },
        sortOptions: {
            type: Object,
            default() {
                return {
                    field: "id",
                    order: "desc"
                }
            }
        },
        optionsLimit: {
            type: Number,
            default: 50
        }
    },
    data() {
        return {
            isLoading: false,
            list: [],
            defaultProps: {
                "trackBy": "id",
                "label": "title",
                "options-limit": this.optionsLimit
            }
        };
    },
    computed: {
        mergedProps() {
            return {...this.defaultProps, ...this.multiselectProps}
        }
    },
    created() {
        this.asyncFind = _.debounce(this.searchList, this.debounceTime);
        this.fetchList();
    },
    methods: {
        searchList(searchQuery) {
            if (!this.endpoint) {
                return;
            }

            this.isLoading = true;
            return axios({
                url: encodeURI(`${this.endpoint}?q=(${this.id}:%${searchQuery}%)&limit=${this.optionsLimit}`),
                method: "GET"
            }).then(response => {
                this.list = response.data.sort(this.orderComparison);
            }).catch(error => {
                this.$notify({
                    text: error.response.data.errors.message,
                    type: "error"
                });
            }).finally(() => {
                this.isLoading = false;
            })
        },
        fetchList() {
            if (!this.endpoint) {
                return;
            }

            this.isLoading = true;
            return axios({
                url: `${this.endpoint}?&limit=${this.optionsLimit}`,
                method: "GET"
            }).then((response) => {
                if (this.excludeOptionId) {
                    this.list = this.excludeOption(response.data)
                    return;
                }

                this.list = response.data.sort(this.orderComparison);
            }).catch((error) => {
                const errorMessage = error.response ? error.response.data.errors.message : error.message;
                this.$notify({
                    text: errorMessage,
                    type: "error"
                });
            }).finally(() => {
                this.isLoading = false;
            });
        },
        excludeOption(list) {
            const newList = list.filter((item) => {
                return item.id !== this.excludeOptionId
            });
            return newList;
        },
        orderComparison(a, b) {
            if (this.sortOptions.order === "desc") {
                return a[this.sortOptions.key] < b[this.sortOptions.key] ? 1 : -1;
            } else if(this.sortOptions.order === "asc") {
                return a[this.sortOptions.key] > b[this.sortOptions.key] ? -1 : 1;
            }
        }
    }
}
</script>

<style lang="scss">
.add-author-button {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
    border-top: 1px solid rgba(0,0,0,.07);
    background-color: var(--secondary-color);
    cursor: pointer;
}

.add-author-button i {
    font-size: 12px;
    margin-right: 5px;
}
</style>
