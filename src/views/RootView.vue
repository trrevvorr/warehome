<template>
  <router-view v-if="isLoadingStateSuccess" />
</template>

<script>
import { mapGetters } from "vuex";
import { useLoadingBar } from "naive-ui";

export default {
  name: "RootView",
  data() {
    return {
      loadingBar: {},
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
  methods: {
  },
};
</script>

<style>
</style>
