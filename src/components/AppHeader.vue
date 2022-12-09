<template>
  <div id="app-header">
    <n-page-header>
      <template #title>
        {{ isLoadingStateSuccess ? location.name : "Loading..." }}
      </template>
      <template #extra>
        <n-space>
          <n-button strong @click="reloadData" :loading="isLoadingStateNotLoaded">
            <template #icon>
              <n-icon><ArrowClockwise12Regular /></n-icon>
            </template>
          </n-button>
          <div class="nav">
            <n-radio-group
              :value="$route.name"
              :on-update:value="(val) => $router.push({ name: val })"
              name="route-group"
            >
              <n-radio-button
                v-for="route in routes"
                :key="route.value"
                :value="route.value"
                :label="route.label"
              />
            </n-radio-group>
          </div>
        </n-space>
      </template>
    </n-page-header>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import {
  NRadioButton,
  NRadioGroup,
  NButton,
  NIcon,
  NSpace,
  NPageHeader,
} from "naive-ui";
import { DataStore } from "@aws-amplify/datastore";
import { ArrowClockwise12Regular } from "@vicons/fluent";

export default {
  name: "RootView",
  components: {
    NRadioButton,
    NRadioGroup,
    NButton,
    NIcon,
    NSpace,
    NPageHeader,
    ArrowClockwise12Regular,
  },
  data() {
    return {
      routes: [
        { label: "Containers", value: "containers" },
        { label: "Items", value: "items" },
      ],
      loadingBar: () => {},
    };
  },
  computed: {
    ...mapGetters(["location", "isLoadingStateNotLoaded", "isLoadingStateSuccess"]),
  },
  methods: {
    ...mapMutations(["setLoadingStateLoading"]),
    async reloadData() {
      this.setLoadingStateLoading();
      await DataStore.clear();
      await DataStore.start();
      console.info("Reloaded data");
    },
  },
};
</script>

<style>
#app-header {
  position: sticky;
  top: 0;
  background-color: rgb(16, 16, 20);
  padding: 0.5rem;
  margin-bottom: 1rem;
  z-index: 999;
  border-bottom: 1px solid rgba(255, 255, 255, 0.24);
}
</style>
