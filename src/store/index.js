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
    containers: (state) =>
      state.containers
        .map((container) => completeContainer(container, state))
        .sort((a, b) =>
          (a.ancestors.asString + a.name).localeCompare(b.ancestors.asString + b.name)
        ),
    items: (state) =>
      state.items
        .map((item) => ({
          ...item,
          container: completeContainer(
            state.containers.find((container) => container.id === item.containerID),
            state
          ),
        }))
        .sort((a, b) => b._lastChangedAt - a._lastChangedAt),
    location: (state) => state.location,
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
      state.containers = containers;
    },
    updateItems(state, items) {
      state.items = items;
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
        switch (msg.opType) {
          case "INSERT":
            commit("updateContainers", [...state.containers, msg.element]);
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

      const items = await DataStore.query(Item, (c) =>
        c.locationID.eq(state.location.id)
      );
      commit("updateItems", items);

      if (state.itemSubscription) {
        state.itemSubscription.unsubscribe();
      }
      state.itemSubscription = DataStore.observe(Item, (c) =>
        c.locationID.eq(state.location.id)
      ).subscribe((msg) => {
        switch (msg.opType) {
          case "INSERT":
            commit("updateItems", [...state.items, msg.element]);
            break;
          case "UPDATE":
            commit("updateItems", [
              ...state.items.filter((c) => c.id !== msg.element.id),
              msg.element,
            ]);
            break;
          case "DELETE":
            commit("updateItems", [
              ...state.items.filter((c) => c.id !== msg.element.id),
            ]);
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
      const originalC = await DataStore.query(Container, input.id);
      const newC = Container.copyOf(originalC, (updated) => {
        updated.name = input.name;
        updated.parentContainerID = input.parentContainerId || undefined;
      });
      await DataStore.save(newC).then(() => {
        commit("updateContainers", [...state.containers.filter((c) => c.id !== input.id), newC]);
      });
    },
    async updateItem({ commit, state }, input) {
      const originalI = await DataStore.query(Item, input.id);
      const newI = Item.copyOf(originalI, (updated) => {
        updated.name = input.name;
        updated.containerID = input.containerId || undefined;
      });
      await DataStore.save(newI).then(() => {
        commit("updateItems", [...state.items.filter((i) => i.id !== input.id), newI]);
      });
    },
    async deleteContainer({ commit, state }, id) {
      await DataStore.delete(await DataStore.query(Container, id));
      commit(
        "updateContainers",
        state.containers.filter((container) => container.id !== id)
      );
    },
    async deleteItem({ commit, state }, id) {
      await DataStore.delete(await DataStore.query(Item, id));
      commit(
        "updateItems",
        state.items.filter((item) => item.id !== id)
      );
    },
  },
  modules: {},
});

function completeContainer(container, state) {
  return container
    ? {
        ...container,
        children: getContainerChildren(container, state.containers),
        ancestors: getContainerAncestors(container, state.containers),
      }
    : null;
}

function getContainerChildren(root, containers) {
  return containers
    .filter((container) => container.parentContainerID === root.id)
    .map((container) => ({
      ...container,
      children: getContainerChildren(container, containers),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function getContainerAncestors(leaf, containers) {
  const ancestors = [];
  let container = leaf;

  while (container) {
    container = containers.find((c) => c.id === container.parentContainerID);
    if (container) {
      ancestors.push(container);
    }
  }

  ancestors.reverse();
  return {
    containers: ancestors,
    asString: containerAncestorString(ancestors),
  };
}

function containerAncestorString(ancestors) {
  return ancestors.reduce((acc, curr) => acc + curr.name + " / ", "");
}
