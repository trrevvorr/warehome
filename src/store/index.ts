import { createStore } from "vuex";
import { DataStore } from "@aws-amplify/datastore";
import { Location, Container, Item } from "../models";
import { ZenObservable } from "zen-observable-ts/lib/types";
import { Auth, Hub } from "aws-amplify";
import { CognitoUser } from "@aws-amplify/auth";
import { HubCallback } from "@aws-amplify/core";
import router, { RouteNames } from "@/router";

const LOCAL_STORAGE_LOCATION_KEY = "local_storage_location_key";
enum LOADING_STATE {
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
  NOT_BEGUN = "not_begun",
}

let dataStoreListener: () => void = () => {};

interface State {
  user: CognitoUser | null;
  activeLocationId: string;
  locations: Location[];
  locationSubscription: ZenObservable.Subscription | null;
  containers: Container[];
  containerSubscription: ZenObservable.Subscription | null;
  items: Item[];
  itemSubscription: ZenObservable.Subscription | null;
  selectedContainerIds: { [key: string]: string };
  loadingState: LOADING_STATE;
}

const initialState: State = {
  user: null,
  activeLocationId: localStorage.getItem(LOCAL_STORAGE_LOCATION_KEY) || "",
  locations: [],
  locationSubscription: null,
  containers: [],
  containerSubscription: null,
  items: [],
  itemSubscription: null,
  selectedContainerIds: {},
  loadingState: LOADING_STATE.NOT_BEGUN,
};

export default createStore({
  state: Object.assign({}, initialState),
  getters: {
    isLoggedIn: (state) => !!state.user,
    containers: (state) => state.containers,
    items: (state) => state.items,
    locations: (state) => state.locations,
    location: (state) => state.locations.find((l) => l.id === state.activeLocationId),
    getChildrenForContainer: (state) => (containerId: string) =>
      childrenForContainer(state, containerId, true),
    getAncestorsForContainer: (state) => (container: Container) =>
      getContainerAncestorsRecursive(container, state.containers),
    getAncestorStringForContainer: (state) => (container: Container) =>
      getContainerAncestorsRecursive(container, state.containers)
        .map((c: Container) => c.name)
        .join(" / "),
    getDescendantsForContainer: (state) => (containerId: string) =>
      getContainerDescendantsRecursive(containerId, state.containers),
    getContainerForItem: (state) => (item: Item) =>
      state.containers.find((c: Container) => c.id === item.containerID),
    getItemsForContainer: (state) => (containerId: string) =>
      state.items.filter((i) => i.containerID === containerId),
    isLoadingStateNotBegun: (state) => state.loadingState === LOADING_STATE.NOT_BEGUN,
    isLoadingStateLoading: (state) => state.loadingState === LOADING_STATE.LOADING,
    isLoadingStateSuccess: (state) => state.loadingState === LOADING_STATE.SUCCESS,
    isLoadingStateError: (state) => state.loadingState === LOADING_STATE.ERROR,
    getRecentContainers:
      (state) =>
      (limit: number, exceptId: string): Container[] => {
        const containers = state.containers.map((c: Container) => ({
          containerId: c.id,
          updatedAt: c.updatedAt,
        }));
        const items = state.items.map((i: Item) => ({
          containerId: i.containerID,
          updatedAt: i.updatedAt,
        }));
        const selectedContainerIds = Object.keys(state.selectedContainerIds).map((id) => ({
          containerId: id,
          updatedAt: state.selectedContainerIds[id],
        }));

        return [
          ...new Set(
            [...containers, ...items, ...selectedContainerIds]
              .sort((a, b) =>
                a.updatedAt && b.updatedAt ? a.updatedAt.localeCompare(b.updatedAt) : 0
              )
              .map((c) => c.containerId)
              .reverse()
          ),
        ]
          .filter((id) => id !== exceptId)
          .slice(0, limit)
          .map((id) => state.containers.find((c) => c.id === id))
          .filter((c) => c) as Container[];
      },
    isContainerDeleteAllowed: (state) => (containerId: string) =>
      containerDeleteAllowedRecursive(state, containerId),
  },
  mutations: {
    updateUser(state, user) {
      state.user = user;
    },
    updateActiveLocation(state, id) {
      localStorage.setItem(LOCAL_STORAGE_LOCATION_KEY, id);
      state.activeLocationId = id;
    },
    updateLocations(state, locations) {
      state.locations = locations.sort((a: Location, b: Location) => a.name.localeCompare(b.name));
    },
    updateContainers(state, containers) {
      state.containers = containers.sort((a: Container, b: Container) =>
        a.name.localeCompare(b.name)
      );
    },
    updateItems(state, items) {
      state.items = items.sort((a: Container, b: Container) =>
        (b.updatedAt || b.createdAt || b.name).localeCompare(a.updatedAt || a.createdAt || a.name)
      );
    },
    addSelectedContainerId(state, id) {
      state.selectedContainerIds[id] = new Date().toISOString();
    },
    setLoadingStateLoading(state) {
      state.loadingState = LOADING_STATE.LOADING;
    },
    setLoadingStateSuccess(state) {
      state.loadingState = LOADING_STATE.SUCCESS;
    },
    setLoadingStateError(state) {
      state.loadingState = LOADING_STATE.ERROR;
    },
    resetState(state) {
      // Merge rather than replace so we don't lose observers
      // https://github.com/vuejs/vuex/issues/1118
      Object.assign(state, initialState);
    },
  },
  actions: {
    async resetApp({ commit }) {
      dataStoreListener(); // Unsubscribe from DataStore
      await DataStore.stop();
      await DataStore.clear();
      commit("resetState");
      return;
    },
    async initUser({ commit, dispatch }): Promise<boolean> {
      const tryUpdateUser = async () => {
        try {
          const user = await Auth.currentAuthenticatedUser();
          commit("updateUser", user);
          await dispatch("initDatastore");
          return true;
        } catch {
          return false;
        }
      };

      const listener: HubCallback = (data) => {
        switch (data.payload.event) {
          case "configured":
            console.debug("the Auth module is configured");
            break;
          case "signIn":
            console.debug("user signed in");
            tryUpdateUser().then(() => router.push("/"));
            break;
          case "signIn_failure":
            console.error("user sign in failed");
            break;
          case "signUp":
            console.debug("user signed up");
            break;
          case "signUp_failure":
            console.error("user sign up failed");
            break;
          case "confirmSignUp":
            console.debug("user confirmation successful");
            tryUpdateUser().then(() => router.push("/"));
            break;
          case "completeNewPassword_failure":
            console.error("user did not complete new password flow");
            break;
          case "autoSignIn":
            console.debug("auto sign in successful");
            tryUpdateUser().then(() => router.push("/"));
            break;
          case "autoSignIn_failure":
            console.error("auto sign in failed");
            break;
          case "forgotPassword":
            console.debug("password recovery initiated");
            break;
          case "forgotPassword_failure":
            console.error("password recovery failed");
            break;
          case "forgotPasswordSubmit":
            console.debug("password confirmation successful");
            break;
          case "forgotPasswordSubmit_failure":
            console.error("password confirmation failed");
            break;
          case "tokenRefresh":
            console.debug("token refresh succeeded");
            break;
          case "tokenRefresh_failure":
            console.error("token refresh failed");
            break;
          case "cognitoHostedUI":
            console.debug("Cognito Hosted UI sign in successful");
            break;
          case "cognitoHostedUI_failure":
            console.error("Cognito Hosted UI sign in failed");
            break;
          case "customOAuthState":
            console.debug("custom state returned from CognitoHosted UI");
            break;
          case "customState_failure":
            console.error("custom state failure");
            break;
          case "parsingCallbackUrl":
            console.debug("Cognito Hosted UI OAuth url parsing initiated");
            break;
          case "userDeleted":
            console.debug("user deletion successful");
            break;
          case "signOut":
            console.debug("user signed out");
            dispatch("resetApp").then(() => router.push({ name: RouteNames.Login }));
            break;
        }
      };

      Hub.listen("auth", listener);
      return tryUpdateUser();
    },
    async initDatastore({ commit, dispatch, getters }) {
      commit("setLoadingStateLoading");
      await DataStore.clear();
      await DataStore.start();

      dataStoreListener(); // Unsubscribe from DataStore
      dataStoreListener = Hub.listen("datastore", async (hubData) => {
        const { event } = hubData.payload;
        if (event === "ready") {
          // all data models are synced from the cloud
          await dispatch("syncLocations")
            .then(() => {
              commit("setLoadingStateSuccess");
            })
            .catch((err) => {
              console.error(err);
              commit("setLoadingStateError");
            });
        }
      });
    },
    async syncLocations({ commit, dispatch, state, getters }) {
      const locations = await DataStore.query(Location);
      commit("updateLocations", locations);
      if (locations.length == 0) {
        throw new Error("No locations found");
      }
      const locationId = getters.location?.id || locations[0].id;
      await dispatch("changeLocation", locationId);

      if (state.locationSubscription) {
        state.locationSubscription.unsubscribe();
      }
      state.locationSubscription = DataStore.observe(Location).subscribe((msg) => {
        console.debug(
          `Location subscription ${msg.opType}: ${msg.element.name} - ${msg.element.id}`
        );
        switch (msg.opType) {
          case "INSERT":
            commit("updateLocations", [
              ...state.locations.filter((c) => c.id !== msg.element.id),
              msg.element,
            ]);
            break;
          case "UPDATE":
            commit("updateLocations", [
              ...state.locations.filter((c) => c.id !== msg.element.id),
              msg.element,
            ]);
            break;
          case "DELETE":
            commit("updateLocations", [...state.locations.filter((c) => c.id !== msg.element.id)]);
            break;
          default:
            console.warn("Unexpected operation type on location: " + msg.opType);
        }
      });
    },
    async changeLocation({ commit, dispatch, state }, locationId) {
      if (state.activeLocationId === locationId) {
        console.warn("Location already active");
        return;
      }
      if (!state.locations.find((l) => l.id === locationId)) {
        throw new Error("Location not found");
      }
      commit("updateActiveLocation", locationId);
      await dispatch("syncContainers");
      await dispatch("syncItems");
    },
    async syncContainers({ commit, state, getters }) {
      const location = assertLocation(getters.location);
      const containers = await DataStore.query(Container, (c) => c.locationID.eq(location.id));
      commit("updateContainers", containers);

      if (state.containerSubscription) {
        state.containerSubscription.unsubscribe();
      }
      state.containerSubscription = DataStore.observe(Container, (c) =>
        c.locationID.eq(location.id)
      ).subscribe((msg) => {
        console.debug(
          `Container subscription ${msg.opType}: ${msg.element.name} - ${msg.element.id}`
        );
        switch (msg.opType) {
          case "INSERT":
            commit("updateContainers", [
              ...state.containers.filter((c) => c.id !== msg.element.id),
              msg.element,
            ]);
            break;
          case "UPDATE":
            commit("updateContainers", [
              ...state.containers.filter((c) => c.id !== msg.element.id),
              msg.element,
            ]);
            break;
          case "DELETE":
            commit("updateContainers", [
              ...state.containers.filter((c) => c.id !== msg.element.id),
            ]);
            break;
          default:
            console.warn("Unexpected operation type on container: " + msg.opType);
        }
      });
    },
    async syncItems({ commit, state, getters }) {
      const location = assertLocation(getters.location);
      const items = await DataStore.query(Item, (c) => c.locationID.eq(location.id));
      commit("updateItems", items);

      if (state.itemSubscription) {
        state.itemSubscription.unsubscribe();
      }
      state.itemSubscription = DataStore.observe(Item, (c) =>
        c.locationID.eq(location.id)
      ).subscribe((msg) => {
        console.debug(`Item subscription ${msg.opType}: ${msg.element.name} - ${msg.element.id}`);
        switch (msg.opType) {
          case "INSERT":
            commit("updateItems", [
              ...state.items.filter((c) => c.id !== msg.element.id),
              msg.element,
            ]);
            break;
          case "UPDATE":
            commit("updateItems", [
              ...state.items.filter((c) => c.id !== msg.element.id),
              msg.element,
            ]);
            break;
          case "DELETE":
            commit("updateItems", [...state.items.filter((c) => c.id !== msg.element.id)]);
            break;
          default:
            console.warn("Unexpected operation type on item: " + msg.opType);
        }
      });
    },
    async addContainer({ commit, state, getters }, input) {
      const location = assertLocation(getters.location);
      const container = new Container({
        name: input.name,
        locationID: location.id,
        parentContainerID: input.parentContainerId || undefined,
      });

      await DataStore.save(container).then(() => {
        commit("updateContainers", [...state.containers, container]);
      });
    },
    async addLocation({ commit, state }, input) {
      const location = new Location({
        name: input.name,
      });
      await DataStore.save(location).then(() => {
        commit("updateLocations", [...state.locations, location]);
      });
    },
    async addItem({ commit, state, getters }, input) {
      const location = assertLocation(getters.location);
      const item = new Item({
        name: input.name,
        locationID: location.id,
        containerID: input.containerId || undefined,
      });
      await DataStore.save(item).then(() => {
        commit("updateItems", [...state.items, item]);
      });
    },
    async updateContainer({ commit, state }, input) {
      await DataStore.query(Container, input.id).then(async (originalContainer) => {
        if (originalContainer) {
          const newContainer = Container.copyOf(originalContainer, (updated) => {
            updated.name = input.name;
            updated.parentContainerID = input.parentContainerId || undefined;
          });
          await DataStore.save(newContainer).then(() => {
            commit("updateContainers", [
              ...state.containers.filter((c) => c.id !== input.id),
              newContainer,
            ]);
          });
        }
      });
    },
    async updateLocation({ commit, state }, input) {
      await DataStore.query(Location, input.id).then(async (originalLocation) => {
        if (originalLocation) {
          const newLocation = Location.copyOf(originalLocation, (updated) => {
            updated.name = input.name;
          });
          await DataStore.save(newLocation).then(() => {
            commit("updateLocations", [
              ...state.locations.filter((i) => i.id !== input.id),
              newLocation,
            ]);
          });
        }
      });
    },
    async updateItem({ commit, state }, input) {
      await DataStore.query(Item, input.id).then(async (originalItem) => {
        if (originalItem) {
          const newItem = Item.copyOf(originalItem, (updated) => {
            updated.name = input.name;
            updated.containerID = input.containerId || undefined;
          });
          await DataStore.save(newItem).then(() => {
            commit("updateItems", [...state.items.filter((i) => i.id !== input.id), newItem]);
          });
        }
      });
    },
    async deleteContainer({ commit, state, dispatch }, id) {
      const container = await DataStore.query(Container, id);
      if (container) {
        if (!containerDeleteAllowedRecursive(state, id)) {
          throw new Error(`Container ${container.id} is not empty.`);
        }

        const containerChildren = childrenForContainer(state, id);
        await Promise.all(containerChildren.map((c) => dispatch("deleteContainer", c.id))).then(
          () =>
            DataStore.delete(container).then(() =>
              commit(
                "updateContainers",
                state.containers.filter((container) => container.id !== id)
              )
            )
        );
      }
    },
    async deleteItem({ commit, state }, id) {
      const item = await DataStore.query(Item, id);
      if (item) {
        await DataStore.delete(item).then(() =>
          commit(
            "updateItems",
            state.items.filter((item) => item.id !== id)
          )
        );
      }
    },
  },
  modules: {},
});

function containerDeleteAllowedRecursive(state: State, containerId: string): boolean {
  if (!containerId) return false;
  const items = state.items.filter((i) => i.containerID === containerId);
  if (items.length) return false;

  const children = childrenForContainer(state, containerId);
  return children.every((c) => containerDeleteAllowedRecursive(state, c.id));
}

function childrenForContainer(
  state: State,
  containerId: string,
  sorted: boolean = false
): Container[] {
  const children = state.containers.filter((c: Container) => c.parentContainerID === containerId);
  if (sorted) {
    return sortContainers(children);
  } else {
    return children;
  }
}

function getContainerDescendantsRecursive(
  containerId: string,
  containers: Container[]
): Container[] {
  const children = containers.filter((c) => c.parentContainerID === containerId);
  if (children.length) {
    return [
      ...children,
      ...children.flatMap((c) => getContainerDescendantsRecursive(c.id, containers)),
    ];
  } else {
    return [];
  }
}

function getContainerAncestorsRecursive(
  container: Container,
  containers: Container[]
): Container[] {
  if (!container.parentContainerID) {
    return [];
  }
  const parent = containers.find((c) => c.id === container.parentContainerID);
  if (parent) {
    return [...getContainerAncestorsRecursive(parent, containers), parent];
  } else {
    return [];
  }
}

function assertLocation(location: Location | null): Location {
  if (!location) {
    throw new Error("Location not loaded");
  }
  return location;
}

function sortContainers(containers: Container[]): Container[] {
  if (containers.length < 2) {
    return containers;
  }
  const firstName = containers[0].name;

  // calculate prefix
  let prefix = "";
  let nextPrefix = "";
  do {
    prefix = nextPrefix;
    nextPrefix = firstName.slice(0, prefix.length + 1);
  } while (containers.every((c) => c.name.startsWith(nextPrefix)) && nextPrefix !== prefix);

  // calculate suffix
  let suffix = "";
  let nextSuffix = "";
  do {
    suffix = nextSuffix;
    nextSuffix = containers[0].name.slice(
      firstName.length - suffix.length - 1,
      firstName.length - 1
    );
  } while (
    containers.every((c) => c.name.endsWith(nextSuffix)) &&
    nextSuffix !== suffix &&
    (prefix + nextSuffix).length <= firstName.length
  );

  // sort based on prefix and suffix
  return containers.sort((a, b) => {
    const aName = a.name.slice(prefix.length, a.name.length - suffix.length);
    const bName = b.name.slice(prefix.length, b.name.length - suffix.length);
    const aNumber = parseInt(aName);
    const bNumber = parseInt(bName);
    if (isNaN(aNumber) || isNaN(bNumber)) {
      return aName.localeCompare(bName);
    } else {
      return aNumber - bNumber;
    }
  });
}
