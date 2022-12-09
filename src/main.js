import { createApp } from "vue";
import App from "./App.vue";
import { Amplify, DataStore, syncExpression } from "aws-amplify";
import awsconfig from "./aws-exports";
import store from "./store";
import router from "./router";
import { Container, Item, Location } from "./models";

// TODO: Get the location ID from the user
const locationId = "7a8aa9e5-b603-4b3e-8bcc-8f3c4154c24f";

DataStore.configure({
  syncExpressions: [
    syncExpression(Location, async () => {
      return (l) => l.id.eq(locationId);
    }),
    syncExpression(Container, async () => {
      return (c) => c.locationID.eq(locationId);
    }),
    syncExpression(Item, async () => {
      return (i) => i.locationID.eq(locationId);
    }),
  ],
});
Amplify.configure(awsconfig);

createApp(App).use(router).use(store).mount("#app");
