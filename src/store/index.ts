import { createStore } from "vuex";
import { DataStore } from "@aws-amplify/datastore";
import { Location, Container, Item, LazyContainer } from "../models";
import { ZenObservable } from "zen-observable-ts/lib/types";

enum LOADING_STATE {
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
  NOT_BEGUN = "not_begun",
}

interface State {
  location: Location | null;
  locationSubscription: ZenObservable.Subscription | null;
  containers: Container[];
  containerSubscription: ZenObservable.Subscription | null;
  items: Item[];
  itemSubscription: ZenObservable.Subscription | null;
  selectedContainerIds: { [key: string]: string };
  loadingState: LOADING_STATE;
}

const initialState: State = {
  location: null,
  locationSubscription: null,
  containers: [],
  containerSubscription: null,
  items: [],
  itemSubscription: null,
  selectedContainerIds: {},
  loadingState: LOADING_STATE.NOT_BEGUN,
};

export default createStore({
  state: initialState,
  getters: {
    containers: (state) => state.containers,
    items: (state) => state.items,
    location: (state) => state.location,
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
    isLoadingStateNotLoaded: (state) =>
      [LOADING_STATE.LOADING, LOADING_STATE.NOT_BEGUN].includes(state.loadingState),
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
    updateLocation(state, location) {
      state.location = location;
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
      const location = assertLocation(state.location);
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
    async syncItems({ commit, state }) {
      const location = assertLocation(state.location);
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
    async addContainer({ commit, state }, input) {
      const location = assertLocation(state.location);
      const container = new Container({
        name: input.name,
        locationID: location.id,
        parentContainerID: input.parentContainerId || undefined,
      });

      await DataStore.save(container).then(() => {
        commit("updateContainers", [...state.containers, container]);
      });
    },
    async addItem({ commit, state }, input) {
      const location = assertLocation(state.location);
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
