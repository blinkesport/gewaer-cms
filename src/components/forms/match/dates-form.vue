<template>
    <div>
        <div class="row">
            <div class="col">
                <h3 class="title">Dates</h3>
            </div>
        </div>
        <div class="dates-form">
            <div class="row">
                <div class="col-12 col-sm-6 col-md-auto">
                    <div class="switch">
                        <label class="mb-0 mr-2">Scheduled</label>
                        <vue-switches
                            v-model="matchScheduled"
                            :selected="matchScheduled"
                            :emit-on-mount="false"
                            class="state-switch mb-0 d-flex align-items-center"
                            theme="bulma"
                        />
                    </div>
                </div>
                <div class="col-12 col-sm-6 col-md-auto">
                    <label class="mb-0 mr-2">Start Date</label>
                    <el-date-picker
                        v-model="startDate"
                        :clearable="false"
                        :value-format="'yyyy-MM-dd HH:mm'"
                        :format="'dd MMM yyyy hh:mm A'"
                        class="datetime-picker"
                        size="small"
                        type="datetime"
                        placeholder="Select a date and time"
                    />
                </div>
                <div class="col-12 col-sm-6 col-md-auto">
                    <label class="mb-0 mr-2">End Date</label>
                    <el-date-picker
                        v-model="endDate"
                        :value-format="'yyyy-MM-dd HH:mm'"
                        :format="'dd MMM yyyy hh:mm A'"
                        class="datetime-picker"
                        size="small"
                        type="datetime"
                        placeholder="Select a date and time"
                    />
                </div>
            </div>
        </div>
    </div>

</template>
<script>

import moment from "moment";
import "moment-timezone";
import { mapState } from "vuex";
import { dateFormats } from "@/utils/helpers";

export default {
    name: "TeamsForm",
    components: {
        vueSwitches: () => import(/* webpackChunkName: "vue-switches" */ "@c/forms/switches")
    },
    data() {
        return {
            teamsEndpoint: "/teams"
        }
    },
    computed: {
        ...mapState({
            timezone: state => state.User.data.timezone
        }),
        matchScheduled: {
            get() {
                return Number(this.$store.state.Match.data.is_scheduled);
            },
            set(scheduledStatus) {
                this.$store.commit("Match/SET_MATCH_SCHEDULED_STATUS", scheduledStatus);
            }
        },
        startDate: {
            get() {
                const startDate = this.$store.state.Match.data.start_time;
                if (!startDate) {
                    return moment().tz(this.timezone).toDate();
                }
                return moment(startDate).tz(this.timezone).toDate();
            },
            set(date) {
                const startDate = moment.utc(date).format(dateFormats.dateTimeStamp);
                this.$store.commit("Match/SET_START_DATE_TIME", startDate);
            }
        },
        endDate: {
            get() {
                const endDate = this.$store.state.Match.data.end_time;
                if (!endDate) {
                    return moment().tz(this.timezone).toDate();
                }
                return moment(endDate).tz(this.timezone).toDate();
            },
            set(date) {
                const endDate = moment.utc(date).format(dateFormats.dateTimeStamp);
                this.$store.commit("Match/SET_END_DATE_TIME", endDate);

            }
        }
    }
}
</script>
<style lang="scss">
.dates-form {
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
</style>
