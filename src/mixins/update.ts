import { defineComponent, h } from "vue";
import { useMessage, NButton, NSpace, NText } from "naive-ui";
import { MessageApiInjection, MessageReactive } from "naive-ui/es/message/src/MessageProvider";

export default defineComponent({
  data() {
    return {
      registration: null as any,
      updateExists: false,
      refreshing: false,
      message: {} as MessageApiInjection,
      messageReactive: {} as MessageReactive,
    };
  },
  created() {
    this.message = useMessage();
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
  watch: {
    updateExists(newUpdateExists) {
      if (newUpdateExists) {
        this.messageReactive = this.message.info(
          () =>
            h(
              NSpace,
              {
                align: "center",
              },
              {
                default: () => [
                  h(
                    NText,
                    {
                      strong: true,
                    },
                    { default: () => "A new version is available" }
                  ),
                  h(
                    NButton,
                    {
                      strong: true,
                      tertiary: true,
                      size: "small",
                      onClick: () => {
                        this.refreshApp();
                      },
                    },
                    { default: () => "Update" }
                  ),
                ],
              }
            ),
          { closable: true, duration: 30_000 }
        );
      } else {
        this.messageReactive.destroy && this.messageReactive.destroy();
      }
    },
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
