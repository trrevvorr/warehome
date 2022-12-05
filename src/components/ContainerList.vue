<template>
  <div class="container-list">
    <div class="container-root list-row" v-for="container in rootContainers" :key="container.id">
      <span><span class="area-name">{{container.area.name}} > </span>{{container.name}}</span>
      <ContainerListRecursive v-if="(container.children.length)" :containers="container.children" />
      <button v-else @click="deleteContainer(container.id)">Delete</button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ContainerListRecursive from "./ContainerListRecursive.vue";

export default {
  name: "ContainerList",
  components: {
    ContainerListRecursive,
  },
  computed: {
    ...mapGetters(["containers"]),
    rootContainers() {
      return this.containers.filter((container) => !container.parentContainerID);
    }
  },
  methods: {
    ...mapActions(["deleteContainer"]),
  },
};
</script>

<style scoped>
.container-root {
  margin-bottom: 1rem;;
}
button {
  margin-left: 10px;
}
.area-name {
  color: #b1b1b1;
}
</style>
