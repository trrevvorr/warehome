<template>
  <button @click="updateExists = true">Test</button>
  <router-view v-if="isLoadingStateSuccess" />
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { useLoadingBar, useMessage } from "naive-ui";
import { LoadingBarInst } from "naive-ui/es/loading-bar/src/LoadingBarProvider";
import { defineComponent } from "vue";
import update from "@/mixins/update";
import { MessageApiInjection } from "naive-ui/es/message/src/MessageProvider";

export default defineComponent({
  name: "RootView",
  mixins: [update],
  data() {
    return {
      loadingBar: {} as LoadingBarInst,
      message: {} as MessageApiInjection,
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
    updateExists(newUpdateExists) {
      if (newUpdateExists) {
        this.message.info("Update available", { closable: true });
      }
    },
  },
  created() {
    this.loadingBar = useLoadingBar();
    if (this.isLoadingStateNotLoaded) {
      this.loadingBar.start();
    }
    this.message = useMessage();
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
