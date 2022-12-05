import { createStore } from 'vuex'
import { DataStore } from '@aws-amplify/datastore';
import { Location, Area, Container, Item } from '../models';

export default createStore({
  state: {
    locationId: null,
    locationName: '',
    areas: [],
    containers: [],
    items: [],
  },
  getters: {
    areas: state => state.areas,
    containers: state => state.containers.map(container => ({
      ...container,
      area: state.areas.find(area => area.id === container.areaID),
      children: getChildContainers(container, state.containers),
    })),
    items: state => state.items.map(item => ({
      ...item, 
      container: state.containers.find(container => container.id === item.containerID)
    })),
    location: state => ({name: state.locationName, id: state.locationId}),
  },
  mutations: {
    updateLocation(state, location) {
      state.locationId = location.id;
      state.locationName = location.name;
    },
    updateAreas(state, areas) {
      state.areas = areas;
    },
    updateContainers(state, containers) {
      state.containers = containers;
    },
    updateItems(state, items) {
      state.items = items;
    }
  },
  actions: {
    async loadLocation({ commit, dispatch }, id) {
      const location = await DataStore.query(Location, id);
      commit('updateLocation', location);
      await Promise.all([
        dispatch('loadAreas'),
        dispatch('loadContainers'),
        dispatch('loadItems'),
      ])
    },
    async loadAreas({ commit, state }) {
      const location = await DataStore.query(Location, state.locationId);
      const areas = await location.Areas.toArray();
      commit('updateAreas', areas);
    },
    async loadContainers({ commit, state }) {
      const location = await DataStore.query(Location, state.locationId);
      const containers = await location.Containers.toArray();
      commit('updateContainers', containers);
    },
    async loadItems({ commit, state }) {
      const location = await DataStore.query(Location, state.locationId);
      const items = await location.Items.toArray();
      commit('updateItems', items);
    },
    async addArea({ commit, state }, name) {
      const area = new Area({
        name: name,
        locationID: state.locationId,
      });
      
      DataStore.save(area).then(() => {
        commit('updateAreas', [...state.areas, area]);
      })
    },
    async addContainer({ commit, state }, input) {
      const container = new Container({
        name: input.name,
        locationID: state.locationId,
        areaID: input.areaId || undefined,
        parentContainerID: input.parentContainerId || undefined,
      });

      DataStore.save(container).then(() => {
        commit('updateContainers', [...state.containers, container]);
      })
    },
    async addItem({ commit, state }, name, containerId) {
      const item = new Item({
        name: name,
        locationID: state.locationId,
        containerID: containerId || undefined,
      });
      await DataStore.save(item).then(() => {
        commit('updateItems', [...state.items, item]);
      })

    },
    async deleteArea({ commit, state }, id) {
      await DataStore.delete(await DataStore.query(Area, id));
      commit('updateAreas', state.areas.filter(area => area.id !== id));
    },
    async deleteContainer({ commit, state }, id) {
      await DataStore.delete(await DataStore.query(Container, id));
      commit('updateContainers', state.containers.filter(container => container.id !== id));
    },
    async deleteItem({ commit, state }, id) {
      await DataStore.delete(await DataStore.query(Item, id));
      commit('updateItems', state.items.filter(item => item.id !== id));
    }
  },
  modules: {
  }
})


function getChildContainers(root, containers) {
  return containers
    .filter(container => container.parentContainerID === root.id)
    .map(container => ({
      ...container,
      children: getChildContainers(container, containers),
    }));
}