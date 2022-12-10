<template>
  <n-config-provider :theme="darkTheme">
    <n-global-style />
    <n-dialog-provider>
      <n-message-provider placement="bottom">
        <n-loading-bar-provider>
          <div id="wrapper">
            <app-header />
            <div id="root">
              <root-view />
            </div>
          </div>
        </n-loading-bar-provider>
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script lang="ts">
import { DataStore, Hub } from "aws-amplify";
import {
  NLoadingBarProvider,
  NConfigProvider,
  NDialogProvider,
  NMessageProvider,
  NGlobalStyle,
} from "naive-ui";
import RootView from "./views/RootView.vue";
import { mapActions, mapMutations } from "vuex";
import { Location } from "./models";
import { darkTheme } from "naive-ui";
import AppHeader from "./components/AppHeader.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  components: {
    NLoadingBarProvider,
    NConfigProvider,
    NDialogProvider,
    NMessageProvider,
    NGlobalStyle,
    RootView,
    AppHeader,
  },
  data: () => ({
    listener: () => {},
    darkTheme,
  }),
  created() {
    this.setLoadingStateLoading();
    DataStore.start();

    this.listener = Hub.listen("datastore", async (hubData) => {
      const { event } = hubData.payload;
      if (event === "ready") {
        // all data models are synced from the cloud
        DataStore.query(Location)
          .then((locations) => {
            if (locations.length === 0) {
              throw new Error("No locations found");
            }

            this.loadLocation(locations[0].id).then(() => {
              this.setLoadingStateSuccess();
            });
          })
          .catch((err) => {
            console.error(err);
            this.setLoadingStateError();
          });
      }
    });
  },
  methods: {
    ...mapActions(["loadLocation"]),
    ...mapMutations(["setLoadingStateLoading", "setLoadingStateError", "setLoadingStateSuccess"]),
  },
  unmounted() {
    // Remove listener
    this.listener();
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0 auto;
}

#wrapper {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100vh;
}

#root {
  max-width: 40rem;
  padding: 0 1rem;
  margin: 0 auto;
  overflow-y: scroll;
  padding-top: 1rem;
}

.n-h {
  margin: 0;
}

body {
  touch-action: none;
}
</style>
