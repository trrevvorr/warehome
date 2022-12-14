<template>
  <div id="app-footer">
    <n-button
      quaternary
      size="large"
      @click="$router.push({ name: RouteNames.Locations })"
      :type="isRouteActive(RouteNames.Locations) ? 'primary' : 'tertiary'"
    >
      <template #icon>
        <n-icon>
          <Globe16Filled v-if="isRouteActive(RouteNames.Locations)" />
          <Globe16Regular v-else />
        </n-icon>
      </template>
    </n-button>
    <n-button
      quaternary
      size="large"
      @click="$router.push({ name: RouteNames.Containers })"
      :type="isRouteActive(RouteNames.Containers) ? 'primary' : 'tertiary'"
    >
      <template #icon>
        <n-icon>
          <BoxMultiple24Filled v-if="isRouteActive(RouteNames.Containers)" />
          <BoxMultiple24Regular v-else />
        </n-icon>
      </template>
    </n-button>
    <n-button
      quaternary
      size="large"
      @click="$router.push({ name: RouteNames.Items })"
      :type="isRouteActive(RouteNames.Items) ? 'primary' : 'tertiary'"
    >
      <template #icon>
        <n-icon>
          <Shapes24Filled v-if="isRouteActive(RouteNames.Items)" />
          <Shapes24Regular v-else />
        </n-icon>
      </template>
    </n-button>
  </div>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { NButton, NIcon } from "naive-ui";
import {
  BoxMultiple24Regular,
  BoxMultiple24Filled,
  Shapes24Regular,
  Shapes24Filled,
  Globe16Regular,
  Globe16Filled,
} from "@vicons/fluent";
import { defineComponent } from "vue";
import { RouteNames } from "@/router";

export default defineComponent({
  name: "RootView",
  components: {
    NButton,
    NIcon,
    BoxMultiple24Regular,
    BoxMultiple24Filled,
    Shapes24Regular,
    Shapes24Filled,
    Globe16Regular,
    Globe16Filled,
  },
  data() {
    return {
      RouteNames,
    };
  },
  computed: {
    ...mapGetters(["isLoggedIn"]),
  },
  methods: {
    isRouteActive(routeName: RouteNames): boolean {
      return this.$route.name?.toString() === routeName;
    },
  },
});
</script>

<style>
#app-footer {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  z-index: 999;
  border-top: 1px solid rgba(255, 255, 255, 0.24);
}

#app-footer .n-button {
  height: 3rem;
}
</style>
