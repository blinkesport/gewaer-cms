<template>
    <div id="app" :class="{ 'full-height' : !($route.meta && $route.meta.requiresAuth == undefined) }">
        <fullscreen-loader />
        <notifications />
        <after-signup-wizard />
        <basic-modal />
        <app-sidebar
            v-if="$route.meta && $route.meta.requiresAuth == undefined"
            :resources="resources"
            :show-sidebar="showSidebar"
            @handle-sidebar="handleSidebar"
        >
            <img slot="app-logo" src="https://mc-canvas.s3.amazonaws.com/gewaer-logo.png">
        </app-sidebar>
        <div class="page-container">
            <app-header
                v-if="$route.meta && $route.meta.requiresAuth == undefined && companyData"
                :companies-list="companiesList"
                :company-data="companyData"
                :show-sidebar="showSidebar"
                :user-data="userData"
                @toggle-notifications="toggleNotifications"
                @selected-company="switchCompany"
            />
            <div class="page-content-wrapper animated">
                <div class="content sm-gutter">
                    <free-trial-bar v-if="$route.meta && $route.meta.requiresAuth == undefined && isTrialSubscription"/>
                    <router-view
                        :app-settings="appSettings"
                        class="container-fluid container-fixed-lg"
                        transition="fade"
                        transition-mode="out-in"
                    />
                </div>
            </div>
        </div>
        <transition name="slide-left" mode="out-in">
            <notification-center
                v-if="showNotificationCenter"
                @toggleNotifications="toggleNotifications"
            />
        </transition>
    </div>
</template>

<script>
const { AppHeader, AppSidebar } = require(`./import.${process.env.VUE_APP_IMPORTS}`);

import { mapActions, mapGetters, mapState } from "vuex";
import { AbilityBuilder } from "@casl/ability";
import AfterSignupWizard from "@/components/modals/after-signup-wizard";
import BasicModal from "@/components/modals/basic-modal";
import FreeTrialBar from "@/views/layout/free-trial-banner";
import NotificationCenter from "@/views/layout/notification-center";

export default {
    components: {
        AfterSignupWizard,
        AppHeader,
        AppSidebar,
        BasicModal,
        FreeTrialBar,
        NotificationCenter,
        fullscreenLoader: () => import(/* webpackChunkName: "hb-fullscreen-loader"*/ "@c/fullscreen-loader/fullscreen-loader.vue")
    },
    data() {
        return {
            appBaseColor: "#61c2cc",
            appSecondaryColor: "#9ee5b5",
            showSidebar: false,
            showNotificationCenter: false
        };
    },
    computed: {
        ...mapState({
            appSettings: state => state.Application.data,
            accessList: state => state.User.data.access_list,
            companyData: state => state.Company.data,
            companiesList: state => state.Company.list,
            resources: state => state.Application.resources,
            userData: state => state.User.data
        }),
        ...mapGetters({
            isTrialSubscription: "Company/isTrialSubscription"
        })
    },
    watch: {
        accessList(permissions) {
            if (permissions) {
                const ability = AbilityBuilder.define((can, cannot) => {
                    can("manage", "all");

                    Object.keys(permissions).forEach((resource) => {
                        Object.keys(permissions[resource]).forEach((action) => {
                            cannot(action, resource);
                        });
                    });
                });

                this.$ability.update(ability.rules);
            }
        }
    },
    async created() {
        await this.getAppData();
        this.appBaseColor = this.appSettings.settings.base_color || this.appBaseColor;
        this.appSecondaryColor = this.appSettings.settings.secondary_color || this.appSecondaryColor;
        this.appInitialize();
    },
    methods: {
        ...mapActions({
            getAppData: "Application/getData"
        }),
        appInitialize() {
            document.body.style.setProperty("--base-color", this.appBaseColor);
            document.body.style.setProperty("--secondary-color", this.appSecondaryColor);
        },
        handleSidebar(state) {
            this.showSidebar = state;
        },
        switchCompany(company) {
            axios({
                url: `/users/${this.userData.id}`,
                method: "PUT",
                data: {
                    "default_company": company.id
                },
                headers: {
                    "SITE-KEY": process.env.VUE_APP_SITE_KEY
                }
            }).then(() => {
                // Solution implemented for now until we can properly refresh all
                // of the user's and company's data through Vuex implementation.
                window.location.reload();
            });
        },
        toggleNotifications() {
            this.showNotificationCenter = !this.showNotificationCenter;
        }
    }
}
</script>
