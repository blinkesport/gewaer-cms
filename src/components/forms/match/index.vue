<template>
    <div>
        <form class="resource-form" @submit.prevent="submitForm()">
            <general-info-form />
            <teams-form />
            <dates-form />

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
                        :to="{ name: 'browse', params: { resource: 'tournaments-matches'} }"
                        :disabled="isLoading"
                        :title="isLoading ? 'Processing, wait a moment...' : 'Cancel'"
                        class="btn m-1 btn-danger float-right"
                    >
                        Cancel
                    </router-link>
                </div>
            </div>
        </form>
    </div>

</template>
<script>

import { mapState } from "vuex";
import cloneDeep from "lodash/cloneDeep";

export default {
    name: "MatchForm",
    components: {
        generalInfoForm: () => import(/* webpackChunkName: "general-info-form" */ "@c/forms/match/general-info-form"),
        teamsForm: () => import(/* webpackChunkName: "teams-form" */ "@c/forms/match/teams-form"),
        datesForm: () => import(/* webpackChunkName: "dates-form" */ "@c/forms/match/dates-form")
    },
    data() {
        return {
            teamsEndpoint: ""
        }
    },
    computed: {
        ...mapState({
            isLoading: state => state.Application.isLoading,
            match: state => state.Match.data
        }),
        isEditing() {
            return Boolean(this.$route.params.id);
        }
    },
    created() {
        this.$store.dispatch("Match/updateCurrent", this.$route.params.id);
    },
    destroyed() {
        this.$store.dispatch("Match/cleanData");
    },
    methods: {
        submitForm() {
            this.$store.commit("Application/SET_IS_LOADING", true);
            const method = this.isEditing ? "PUT" : "POST";
            const url = this.isEditing ? `/tournaments-matches/${this.$route.params.id}` : `/tournaments-matches`;

            const clonedMatch = cloneDeep(this.match);
            clonedMatch.team_a = this.match.team_a.id;
            clonedMatch.team_b = this.match.team_b.id;

            this.$store.dispatch("Application/showLoader", true);
            axios({
                url,
                method,
                data: clonedMatch
            }).then(() => {
                this.$notify({
                    text: "Post saved successfully",
                    type: "success"
                });
                this.$router.push({ name: "browse", params: { resource: "tournaments-matches" } });
            }).catch((error) => {
                this.$notify({
                    text: error.response.data.errors.message,
                    type: "error"
                });
            }).finally(() => {
                this.$store.commit("Application/SET_IS_LOADING", false);
                this.$store.dispatch("Application/showLoader", false);
            });

        }
    }
}
</script>