<template>
  <div id="app-header">
    <n-page-header>
      <template #avatar>
        <n-icon size="30" color="#63e2b7">
          <BoxMultipleSearch24Regular />
        </n-icon>
      </template>
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
            <n-button-group>
              <n-button
                strong
                @click="$router.push({ name: 'containers' })"
                :type="$route.name?.toString() === 'containers' ? 'primary' : 'tertiary'"
              >
                <template #icon>
                  <n-icon><BoxMultiple24Regular /></n-icon>
                </template>
              </n-button>
              <n-button
                strong
                @click="$router.push({ name: 'items' })"
                :type="$route.name?.toString() === 'items' ? 'primary' : 'tertiary'"
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
  BoxMultiple24Regular,
  Shapes24Regular,
} from "@vicons/fluent";
import { defineComponent } from "vue";

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
    BoxMultiple24Regular,
    Shapes24Regular,
  },
  data() {
    return {
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
});
</script>

<style>
#app-header {
  padding: 0.5rem;
  z-index: 999;
  border-bottom: 1px solid rgba(255, 255, 255, 0.24);
}
</style>
