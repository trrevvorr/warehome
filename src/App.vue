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
            <app-footer />
          </div>
        </n-loading-bar-provider>
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script lang="ts">
import {
  NLoadingBarProvider,
  NConfigProvider,
  NDialogProvider,
  NMessageProvider,
  NGlobalStyle,
} from "naive-ui";
import RootView from "./views/RootView.vue";
import { mapActions } from "vuex";
import { darkTheme } from "naive-ui";
import AppHeader from "./components/AppHeader.vue";
import AppFooter from "./components/AppFooter.vue";
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
    AppFooter,
  },
  data: () => ({
    listener: () => {},
    darkTheme,
  }),
  created() {
    this.initUser();
  },
  methods: {
    ...mapActions(["initUser"]),
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
  grid-template-rows: auto 1fr auto;
  height: 100vh;
}

#root {
  max-width: 40rem;
  padding: 0 1rem;
  margin: 0 auto;
  overflow-y: scroll;
  padding-top: 1rem;
  padding-bottom: 3rem;
  position: relative;
}

.n-h {
  margin: 0;
}

body {
  touch-action: none;
}
</style>
