<template>
  <div id="app-header">
    <n-h1>
      <n-text type="primary">
        {{ isLoadingStateSuccess ? location.name : "Loading..." }}
      </n-text>
    </n-h1>
    <n-button strong @click="reloadData" :loading="isLoadingStateNotLoaded">
      <template #icon>
        <n-icon><ArrowClockwise12Regular /></n-icon>
      </template>
    </n-button>
    <div class="nav">
      <n-radio-group
        :value="$route.name"
        :on-update:value="(val) => $router.push({ name: val })"
        name="routegroup"
      >
        <n-radio-button
          v-for="route in routes"
          :key="route.value"
          :value="route.value"
          :label="route.label"
        />
      </n-radio-group>
    </div>
  </div>

  <router-view v-if="isLoadingStateSuccess" />
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { NRadioButton, NRadioGroup, NButton, NIcon, NH1, NText, useLoadingBar } from "naive-ui";
import { DataStore } from "@aws-amplify/datastore";
import { ArrowClockwise12Regular } from "@vicons/fluent";

export default {
  name: "RootView",
  components: {
    NRadioButton,
    NRadioGroup,
    NButton,
    NIcon,
    NH1,
    NText,
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
  watch: {
    isLoadingStateSuccess(newSuccess) {
      if (newSuccess) {
        this.loadingBar.finish();
      }
    },
    isLoadingStateError(newError) {
      if (newError) {
        this.loadingBar.error();
      }
    },
  },
  created() {
    this.loadingBar = useLoadingBar();
    if (this.isLoadingStateNotLoaded) {
      this.loadingBar.start();
    }
  },
  computed: {
    ...mapGetters([
      "location",
      "isLoadingStateNotLoaded",
      "isLoadingStateError",
      "isLoadingStateSuccess",
    ]),
  },
  methods: {
    ...mapMutations(["setLoadingStateLoading", "setLoadingStateError", "setLoadingStateSuccess"]),
    async reloadData() {
      this.loadingBar.start();
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
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
  margin-top: 1rem;
}
</style>
