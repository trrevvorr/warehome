import { createStore } from "vuex";
import { DataStore } from "@aws-amplify/datastore";
import { Location, Container, Item } from "../models";

export default createStore({
  state: {
    locationId: null,
    locationName: "",
    containers: [],
    items: [],
    lastSelectedContainerId: null,
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
    location: (state) => ({ name: state.locationName, id: state.locationId }),
    lastSelectedContainerId: (state) => state.lastSelectedContainerId,
  },
  mutations: {
    updateLocation(state, location) {
      state.locationId = location.id;
      state.locationName = location.name;
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
  },
  actions: {
    async loadLocation({ commit, dispatch }, id) {
      const location = await DataStore.query(Location, id);
      commit("updateLocation", location);
      await dispatch("loadContainers").then(() => dispatch("loadItems"));
    },
    async loadContainers({ commit, state }) {
      const location = await DataStore.query(Location, state.locationId);
      const containers = await location.Containers.toArray();
      commit("updateContainers", containers);
    },
    async loadItems({ commit, state }) {
      const location = await DataStore.query(Location, state.locationId);
      const items = await location.Items.toArray();
      commit("updateItems", items);
    },
    async addContainer({ commit, state }, input) {
      const container = new Container({
        name: input.name,
        locationID: state.locationId,
        parentContainerID: input.parentContainerId || undefined,
      });

      DataStore.save(container).then(() => {
        commit("updateContainers", [...state.containers, container]);
      });
    },
    async addItem({ commit, state }, input) {
      const item = new Item({
        name: input.name,
        locationID: state.locationId,
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
