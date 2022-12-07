import { createStore } from "vuex";
import { DataStore } from "@aws-amplify/datastore";
import { Location, Container, Item } from "../models";

export default createStore({
  state: {
    locationId: null,
    locationName: "",
    containers: [],
    items: [],
  },
  getters: {
    containers: (state) =>
      state.containers
        .map((container) => completeContainer(container, state))
        .sort((a, b) =>
          (a.ancestors.asString + a.name).localeCompare(b.ancestors.asString + b.name)
        ),
    items: (state) =>
      state.items.map((item) => ({
        ...item,
        container: completeContainer(state.containers.find((container) => container.id === item.containerID), state),
      })),
    location: (state) => ({ name: state.locationName, id: state.locationId }),
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
  },
  actions: {
    async loadLocation({ commit, dispatch }, id) {
      const location = await DataStore.query(Location, id);
      commit("updateLocation", location);
      await dispatch("loadContainers")
        .then(() => dispatch("loadItems"));
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
  return {
    ...container,
    children: getContainerChildren(container, state.containers),
    ancestors: getContainerAncestors(container, state.containers),
  };
}

function getContainerChildren(root, containers) {
  return containers
    .filter((container) => container.parentContainerID === root.id)
    .map((container) => ({
      ...container,
      children: getContainerChildren(container, containers),
    }));
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
