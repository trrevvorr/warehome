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
        <n-space v-if="isLoggedIn">
          <n-button strong @click="signOut">
            <template #icon>
              <n-icon><PersonArrowRight16Regular /></n-icon>
            </template>
          </n-button>
          <n-button strong @click="reloadData" :loading="isLoadingStateLoading">
            <template #icon>
              <n-icon><ArrowClockwise12Regular /></n-icon>
            </template>
          </n-button>
          <div class="nav">
            <n-button-group>
              <n-button
                strong
                @click="$router.push({ name: RouteNames.Locations })"
                :type="$route.name?.toString() === RouteNames.Locations ? 'primary' : 'tertiary'"
              >
                <template #icon>
                  <n-icon><Globe16Regular /></n-icon>
                </template>
              </n-button>
              <n-button
                strong
                @click="$router.push({ name: RouteNames.Containers })"
                :type="$route.name?.toString() === RouteNames.Containers ? 'primary' : 'tertiary'"
              >
                <template #icon>
                  <n-icon><BoxMultiple24Regular /></n-icon>
                </template>
              </n-button>
              <n-button
                strong
                @click="$router.push({ name: RouteNames.Items })"
                :type="$route.name?.toString() === RouteNames.Items ? 'primary' : 'tertiary'"
              >
                <template #icon>
                  <n-icon><Shapes24Regular /></n-icon>
                </template>
              </n-button>
            </n-button-group>
          </div>
        </n-space>
      </template>
    </n-page-header>
  </div>
</template>

<script lang="ts">
import { mapGetters, mapMutations } from "vuex";
import { NButton, NIcon, NSpace, NPageHeader, NButtonGroup } from "naive-ui";
import { DataStore } from "@aws-amplify/datastore";
import {
  ArrowClockwise12Regular,
  BoxMultipleSearch24Regular,
  PersonArrowRight16Regular,
  BoxMultiple24Regular,
  Shapes24Regular,
  Globe16Regular,
} from "@vicons/fluent";
import { defineComponent } from "vue";
import { Auth } from "aws-amplify";
import { RouteNames } from "@/router";

export default defineComponent({
  name: "RootView",
  components: {
    NButton,
    NIcon,
    NSpace,
    NPageHeader,
    NButtonGroup,
    ArrowClockwise12Regular,
    BoxMultipleSearch24Regular,
    PersonArrowRight16Regular,
    BoxMultiple24Regular,
    Shapes24Regular,
    Globe16Regular,
  },
  data() {
    return {
      loadingBar: () => {},
      RouteNames,
    };
  },
  computed: {
    ...mapGetters(["location", "isLoadingStateLoading", "isLoadingStateSuccess", "isLoggedIn"]),
  },
  methods: {
    ...mapMutations(["setLoadingStateLoading"]),
    async reloadData() {
      this.setLoadingStateLoading();
      await DataStore.clear();
      await DataStore.start();
      console.info("Reloaded data");
    },
    async signOut() {
      try {
        await Auth.signOut();
      } catch (error) {
        console.log("error signing out: ", error);
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
