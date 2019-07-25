<template>
    <transition name="fade" mode="out-in">
        <div v-if="$store.getters['Application/isLoading']" class="loader">
            <loader :size="50" />
        </div>
    </transition>
</template>

<script>

export default {
    name: "FullscreenLoader",
    components: {
        loader: () => import(/* webpackChunkName: "loader"*/ "@c/loader/loader.vue")
    },
    data() {
        return {
            showLoader: false
        };
    }
}
</script>

<style lang="scss" scoped>
.loader {
    width: 100%;
    height: 100%;
    position: fixed;
    background-color: rgba(255, 255, 255, .8) ;
    top: 0;
    left: 0;
    z-index: 999999999;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
