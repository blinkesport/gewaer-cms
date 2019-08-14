<template>
    <div>
        <div class="row">
            <div class="col">
                <h3 class="title">Teams</h3>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-6 col-md-6 col-sm-12">
                <div class="form-group-multiselect">
                    <label :class="{'text-danger': errors.has('team-a') }">
                        Team A
                        <span v-if="errors.has('team-a')">(required)</span>
                    </label>
                    <multiselect-wrapper
                        v-validate="'required'"
                        id="name"
                        v-model="matchTeamA"
                        :endpoint="teamsEndpoint"
                        :multiselect-props="teamsMultiselectCustomProps"
                        :class="{'border-danger': errors.has('team-a')}"
                        data-vv-as="Team A"
                        name="team-a"
                    />
                </div>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12">
                <div class="form-group-multiselect">
                    <label :class="{'text-danger': errors.has('team-b') }">
                        Team B
                        <span v-if="errors.has('team-b')">(required)</span>
                    </label>
                    <multiselect-wrapper
                        v-validate="'required'"
                        id="name"
                        v-model="matchTeamB"
                        :multiselect-props="teamsMultiselectCustomProps"
                        :endpoint="teamsEndpoint"
                        :class="{'border-danger': errors.has('team-b')}"
                        data-vv-as="Team B"
                        name="team-b"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "TeamsForm",
    components: {
        multiselectWrapper: () => import(/* webpackChunkName: "multiselect-wrapper" */ "@c/multiselect-wrapper/multiselect-wrapper")
    },
    data() {
        return {
            teamsEndpoint: "/teams",
            teamsMultiselectCustomProps: {
                "label": "name",
                "single": true
            }
        }
    },
    computed: {
        matchTeamA: {
            get() {
                return this.$store.state.Match.data.team_a;
            },
            set(teamA) {
                this.$store.commit("Match/SET_TEAM_A", teamA);
            }
        },
        matchTeamB: {
            get() {
                return this.$store.state.Match.data.team_b;
            },
            set(teamB) {
                this.$store.commit("Match/SET_TEAM_B", teamB);
            }
        }
    }
}
</script>
