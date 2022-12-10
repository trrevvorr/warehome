import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      registration: null as any,
      updateExists: false,
      refreshing: false,
    };
  },
  created() {
    document.addEventListener("swUpdated", this.updateAvailable, {
      once: true,
    });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      // We'll also need to add 'refreshing' to our data originally set to false.
      if (this.refreshing) return;
      this.refreshing = true;
      // Here the actual reload of the page occurs
      window.location.reload();
    });
    console.debug("LISTENING FOR UPDATE");
  },
  methods: {
    updateAvailable(event: any) {
      console.debug("UPDATE AVAILABLE");
      this.registration = event.detail;
      this.updateExists = true;
    },
    refreshApp() {
      console.debug("REFRESHING APP");
      this.updateExists = false;
      // Make sure we only send a 'skip waiting' message if the SW is waiting
      if (!this.registration || !this.registration.waiting) return;
      // Send message to SW to skip the waiting and activate the new SW
      this.registration.waiting.postMessage({ type: "SKIP_WAITING" });
    },
  },
});
