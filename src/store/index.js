import { createStore } from "vuex";
import { DataStore } from "@aws-amplify/datastore";
import { Location, Container, Item } from "../models";

const LOADING_STATE = Object.freeze({
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
  NOT_BEGUN: "not_begun",
});

export default createStore({
  state: {
    location: null,
    locationSubscription: null,
    containers: [],
    containerSubscription: null,
    items: [],
    itemSubscription: null,
    lastSelectedContainerId: null,
    loadingState: LOADING_STATE.NOT_BEGUN,
  },
  getters: {
    containers: (state) => state.containers,
    items: (state) => state.items,
    location: (state) => state.location,
    getChildrenForContainer: (state) => (container) =>
      state.containers.filter((c) => c.parentContainerID === container.id),
    getAncestorsForContainer: (state) => (container) =>
      getContainerAncestorsRecursive(container, state.containers),
    getAncestorStringForContainer: (state) => (container) =>
      getContainerAncestorsRecursive(container, state.containers)
        .map((c) => c.name)
        .join(" / "),
    getContainerForItem: (state) => (item) =>
      state.containers.find((c) => c.id === item.containerID),
    lastSelectedContainerId: (state) => state.lastSelectedContainerId,
    isLoadingStateNotLoaded: (state) =>
      state.loadingState === LOADING_STATE.LOADING ||
      state.loadingState === LOADING_STATE.NOT_BEGUN,
    isLoadingStateSuccess: (state) => state.loadingState === LOADING_STATE.SUCCESS,
    isLoadingStateError: (state) => state.loadingState === LOADING_STATE.ERROR,
  },
  mutations: {
    updateLocation(state, location) {
      state.location = location;
    },
    updateContainers(state, containers) {
      state.containers = containers.sort((a, b) => a.name.localeCompare(b.name));
    },
    updateItems(state, items) {
      state.items = items.sort((a, b) => b._lastChangedAt - a._lastChangedAt);
    },
    updateLastSelectedContainerId(state, id) {
      state.lastSelectedContainerId = id;
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
  },
  actions: {
    async loadLocation({ commit, dispatch, state }, id) {
      const location = await DataStore.query(Location, id);
      commit("updateLocation", location);
      await dispatch("syncContainers").then(() => dispatch("syncItems"));

      if (state.locationSubscription) {
        state.locationSubscription.unsubscribe();
      }
      state.locationSubscription = DataStore.observe(Location, id).subscribe((msg) => {
        console.debug(
          `Location subscription ${msg.opType}: ${msg.element.name} - ${msg.element.id}`
        );
        if (msg.opType === "UPDATE") {
          commit("updateLocation", msg.element);
        } else {
          console.warn("Unexpected operation type on location: " + msg.opType);
        }
      });
    },
    async syncContainers({ commit, state }) {
      if (!state.location) {
        throw new Error("Location not loaded");
      }

      const containers = await DataStore.query(Container, (c) =>
        c.locationID.eq(state.location.id)
      );
      commit("updateContainers", containers);

      if (state.containerSubscription) {
        state.containerSubscription.unsubscribe();
      }
      state.containerSubscription = DataStore.observe(Container, (c) =>
        c.locationID.eq(state.location.id)
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
    async syncItems({ commit, state }) {
      if (!state.location) {
        throw new Error("Location not loaded");
      }

      const items = await DataStore.query(Item, (c) => c.locationID.eq(state.location.id));
      commit("updateItems", items);

      if (state.itemSubscription) {
        state.itemSubscription.unsubscribe();
      }
      state.itemSubscription = DataStore.observe(Item, (c) =>
        c.locationID.eq(state.location.id)
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
    async addContainer({ commit, state }, input) {
      const container = new Container({
        name: input.name,
        locationID: state.location.id,
        parentContainerID: input.parentContainerId || undefined,
      });

      DataStore.save(container).then(() => {
        commit("updateContainers", [...state.containers, container]);
      });
    },
    async addItem({ commit, state }, input) {
      const item = new Item({
        name: input.name,
        locationID: state.location.id,
        containerID: input.containerId || undefined,
      });
      await DataStore.save(item).then(() => {
        commit("updateItems", [...state.items, item]);
      });
    },
    async updateContainer({ commit, state }, input) {
      await DataStore.query(Container, input.id).then(async (originalContainer) => {
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
      });
    },
    async updateItem({ commit, state }, input) {
      await DataStore.query(Item, input.id).then(async (originalItem) => {
        const newItem = Item.copyOf(originalItem, (updated) => {
          updated.name = input.name;
          updated.containerID = input.containerId || undefined;
        });
        await DataStore.save(newItem).then(() => {
          commit("updateItems", [...state.items.filter((i) => i.id !== input.id), newItem]);
        });
      });
    },
    async deleteContainer({ commit, state }, id) {
      await DataStore.delete(await DataStore.query(Container, id)).then(
        commit(
          "updateContainers",
          state.containers.filter((container) => container.id !== id)
        )
      );
    },
    async deleteItem({ commit, state }, id) {
      await DataStore.delete(await DataStore.query(Item, id)).then(
        commit(
          "updateItems",
          state.items.filter((item) => item.id !== id)
        )
      );
    },
  },
  modules: {},
});

function getContainerAncestorsRecursive(container, containers) {
  if (!container.parentContainerID) {
    return [];
  }
  const parent = containers.find((c) => c.id === container.parentContainerID);
  return [...getContainerAncestorsRecursive(parent, containers), parent];
}
