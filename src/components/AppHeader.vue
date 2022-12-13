<template>
  <div id="app-header">
    <n-page-header>
      <template #avatar>
        <n-icon size="30" color="#63e2b7">
          <BoxMultipleSearch24Regular />
        </n-icon>
      </template>
      <template #title>
        {{ isLoggedIn ? (isLoadingStateSuccess ? location.name : "Loading...") : "WareHome" }}
      </template>
      <template #extra>
        <n-dropdown trigger="hover" :options="options" @select="handleSelect">
          <n-button text style="font-size: 25px; margin-top: 6px">
            <n-icon><MoreVertical20Filled /></n-icon>
          </n-button>
        </n-dropdown>
      </template>
    </n-page-header>
  </div>
</template>

<script lang="ts">
import { mapActions, mapGetters, mapMutations } from "vuex";
import { DropdownOption, NButton, NIcon, NDropdown, NPageHeader } from "naive-ui";
import {
  ArrowClockwise12Regular,
  BoxMultipleSearch24Regular,
  PersonArrowRight16Regular,
  MoreVertical20Filled,
} from "@vicons/fluent";
import { defineComponent, h, Component } from "vue";
import { Auth } from "aws-amplify";

const MenuKeys = Object.freeze({
  Refresh: "refresh",
  Logout: "logout",
});

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

export default defineComponent({
  name: "RootView",
  components: {
    NButton,
    NIcon,
    NDropdown,
    NPageHeader,
    BoxMultipleSearch24Regular,
    MoreVertical20Filled,
  },
  data() {
    return {
      loadingBar: () => {},
      options: [
        {
          label: "Refresh",
          key: MenuKeys.Refresh,
          icon: renderIcon(ArrowClockwise12Regular),
        },
        {
          label: "Log Out",
          key: MenuKeys.Logout,
          icon: renderIcon(PersonArrowRight16Regular),
        },
      ] as DropdownOption[],
    };
  },
  computed: {
    ...mapGetters(["location", "isLoadingStateLoading", "isLoadingStateSuccess", "isLoggedIn"]),
  },
  methods: {
    ...mapMutations(["setLoadingStateLoading"]),
    ...mapActions(["initDatastore"]),
    async reloadData() {
      await this.initDatastore();
    },
    async signOut() {
      try {
        await Auth.signOut();
      } catch (error) {
        console.log("error signing out: ", error);
      }
    },
    handleSelect(key: string) {
      switch (key) {
        case MenuKeys.Refresh:
          this.reloadData();
          break;
        case MenuKeys.Logout:
          this.signOut();
          break;
      }
    },
  },
});
</script>

<style>
#app-header {
  padding: 0.5rem;
  z-index: 999;
  border-bottom: 1px solid rgba(255, 255, 255, 0.24);
}
</style>
