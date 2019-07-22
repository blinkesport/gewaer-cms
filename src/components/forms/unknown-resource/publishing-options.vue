<template>
    <div class="publishing-options">
        <div class="row">
            <div v-if="showPremium" class="col-12 col-sm-6 col-md-auto">
                <div class="switch">
                    <label class="mb-0 mr-2">Premium</label>
                    <vue-switches
                        v-model="bookInsightPremium"
                        :selected="bookInsightPremium"
                        :emit-on-mount="false"
                        class="state-switch mb-0 d-flex align-items-center"
                        theme="bulma"
                    />
                </div>
            </div>
            <div class="col-12 col-sm-6 col-md-auto">
                <div class="switch">
                    <label class="mb-0 mr-2">{{ featuredLabel }}</label>
                    <vue-switches
                        v-model="bookInsightFeatured"
                        :selected="bookInsightFeatured"
                        :emit-on-mount="false"
                        class="state-switch mb-0 d-flex align-items-center"
                        theme="bulma"
                    />
                </div>
            </div>
            <div class="col-12 col-sm-6 col-md-auto">
                <label class="mb-0 mr-2">Status</label>
                <div class="form-group-multiselect mb-0">
                    <multiselect
                        v-model="bookInsightStatus"
                        :show-labels="false"
                        :allow-empty="false"
                        :options="statusList"
                        track-by="id"
                        label="label"
                    />
                </div>
            </div>
            <div v-if="isScheduled" class="col-12 col-sm-6 col-md-auto">
                <el-date-picker
                    v-model="bookInsightPublished"
                    :clearable="false"
                    :format="'dd MMM yyyy hh:mm A'"
                    class="datetime-picker"
                    size="small"
                    type="datetime"
                    placeholder="Select a date and time"
                />
            </div>
        </div>
    </div>
</template>

<script>

import pick from "lodash/pick";
import Vue from "vue";
import { DatePicker } from "element-ui";
Vue.use(DatePicker);
import lang from "element-ui/lib/locale/lang/en"
import locale from "element-ui/lib/locale"
locale.use(lang);
import moment from "moment";
import { mapGetters } from "vuex";

export default {
    name: "PublishingOptions",
    components: {
        vueSwitches: () => import(/* webpackChunkName: "vue-switches" */ "@c/switches")
    },
    props: {
        model: {
            type: Object,
            required: true
        },
        showPremium: {
            type: Boolean,
            default: true
        },
        featuredLabel: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            partialData: pick(this.model, [
                "status",
                "published_at",
                "premium",
                "featured"
            ]),
            // TODO: waiting for endpoint.
            statusList: [
                {
                    id: 1,
                    label: "Draft"
                },
                {
                    id: 2,
                    label: "Scheduled"
                },
                {
                    id: 3,
                    label: "Published"
                }
            ]
        };
    },
    computed: {
        ...mapGetters({
            isScheduled: "BookInsight/isSchedule"
        }),
        published_at: {
            get() {
                if (this.partialData.published_at) {
                    return moment.utc(this.partialData.published_at).tz("America/New_York").format("YYYY-MM-DD HH:mm:ss");
                }
            },
            set(value) {
                this.partialData.published_at = moment.utc(value).format("YYYY-MM-DD HH:mm:ss");
            }
        },
        bookInsightPremium: {
            get() {
                return Number(this.$store.state.BookInsight.bookInsight.premium);
            },
            set(value) {
                this.$store.commit("BookInsight/SET_PREMIUM_STATUS", value);
            }
        },
        bookInsightFeatured: {
            get() {
                return Number(this.$store.state.BookInsight.bookInsight.featured);
            },
            set(value) {
                this.$store.commit("BookInsight/SET_FEATURED", value);
            }
        },
        bookInsightPublished: {
            get() {
                const publishedAt = this.$store.state.BookInsight.bookInsight.published_at;
                return moment.utc(publishedAt).format("YYYY-MM-DD HH:mm:ss");
            },
            set(value) {
                const publishedAt = moment.utc(value).format("YYYY-MM-DD HH:mm:ss");
                this.$store.commit("BookInsight/SET_PUBLISHED_AT", publishedAt);
            }
        },
        bookInsightStatus: {
            get() {
                const remoteStatus = Number(this.$store.state.BookInsight.bookInsight.status);
                return this.statusList.find((status) => {
                    return remoteStatus === status.id
                });
            },
            set(value) {
                const draftStatus = 1;
                if (value.id == draftStatus) {
                    this.$store.commit("BookInsight/SET_PUBLISHED_AT", null);
                } else {
                    const publishedAt = moment.utc().format("YYYY-MM-DD HH:mm:ss");
                    this.$store.commit("BookInsight/SET_PUBLISHED_AT", publishedAt);
                }
                this.$store.commit("BookInsight/SET_STATUS", value.id);
            }
        }
    },
    watch: {
        partialData: {
            handler(newPartialData) {
                this.$emit("audiobook-publishing-options-changed", newPartialData);
            },
            deep: true
        }
    }
}
</script>

<style lang="scss">
.publishing-options {
    .row > [class*=col] {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 15px;

        .switch {
            display: flex;
            align-items: center;
            justify-content: center;
            padding-right: 15px !important;
        }
    }
}

.el-picker-panel {
    .el-date-table td.current:not(.disabled) span {
        background-color: var(--base-color);
    }

    .el-date-table td.today span,
    .el-date-table td.available:hover {
        color: var(--base-color);
    }

    .el-date-table td.current:not(.disabled) span {
        color: white;
    }

    .el-input__inner:focus {
        border-color: var(--base-color);
        outline: 0;
    }

    .el-button {
        background-color: var(--base-color);
        border: 0;
        color: white;
        padding: 3px 15px;
        margin-right: 5px;
        cursor: pointer;

        &:last-child {
            margin-right: 0;
        }
    }
}
</style>
