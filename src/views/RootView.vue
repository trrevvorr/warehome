<template>
  <router-view v-if="isLoadingStateSuccess || !isLoggedIn" />
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { useLoadingBar } from "naive-ui";
import { LoadingBarInst } from "naive-ui/es/loading-bar/src/LoadingBarProvider";
import { defineComponent } from "vue";
import update from "@/mixins/update";

export default defineComponent({
  name: "RootView",
  mixins: [update],
  data() {
    return {
      loadingBar: {} as LoadingBarInst,
    };
  },
  watch: {
    isLoadingStateLoading(newNotLoaded) {
      if (newNotLoaded) {
        this.loadingBar.start();
      }
    },
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
    if (this.isLoadingStateLoading) {
      this.loadingBar.start();
    }
  },
  computed: {
    ...mapGetters([
      "location",
      "isLoadingStateLoading",
      "isLoadingStateError",
      "isLoadingStateSuccess",
      "isLoggedIn",
    ]),
  },
});
</script>

<style></style>
