<template>
  <router-view v-if="isLoadingStateSuccess" />
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { useLoadingBar } from "naive-ui";
import { LoadingBarInst } from "naive-ui/es/loading-bar/src/LoadingBarProvider";
import { defineComponent } from "vue";

export default defineComponent({
  name: "RootView",
  data() {
    return {
      loadingBar: {} as LoadingBarInst,
    };
  },
  watch: {
    isLoadingStateNotLoaded(newNotLoaded) {
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
  methods: {},
});
</script>

<style></style>
