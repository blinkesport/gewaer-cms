<template>
    <div>
        <div class="row">
            <div class="col">
                <h3 class="title">General</h3>
            </div>
        </div>
        <div class="row">
            <div class="col-md-4 col-sm-6 col-lg-4">
                <div :class="{ 'border-danger': errors.has('third-party-id') }" class="form-group form-group-default">
                    <label :class="{'text-danger': errors.has('third-party-id') }">
                        Third Party Id
                        <span v-if="errors.has('third-party-id')">({{ errors.first('third-party-id') }})</span>
                    </label>
                    <input
                        v-validate="'required|integer|min_value:1'"
                        v-model="thirdPartyId"
                        class="form-control"
                        type="number"
                        name="third-party-id"
                        data-vv-as="Third Party Id"
                        data-vv-validate-on="change"
                    >
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "GeneralInfo",
    computed: {
        thirdPartyId: {
            get() {
                return this.$store.state.Match.data.third_party_id;
            },
            set(value) {
                this.$store.commit("Match/SET_THIRD_PARTY_ID", value);
            }
        }
    }
}
</script>

<style lang="scss">

</style>
