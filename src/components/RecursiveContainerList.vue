<template>
  <div :class="{ 'recursive-container-list': true, 'not-root': isNotRoot }">
    <div v-for="container in rootContainers" :key="container.id">
      <span v-if="isNotRoot">/ </span>
      <router-link class="container-name" :to="'/containers/' + container.id">{{
        container.name
      }}</router-link>
      <recursive-container-list :containers="container.decedents" :parentId="container.id" />
    </div>
  </div>
</template>

<script>
// import { NCollapseItem, NCollapse } from "naive-ui";

export default {
  name: "RecursiveContainerList",
  // components: { NCollapseItem, NCollapse },
  props: {
    containers: {
      type: Array,
      required: true,
    },
    parentId: {
      type: String,
      default: undefined,
    },
  },
  computed: {
    rootContainers() {
      return this.containers
        .filter((c) => c.parentContainerID == this.parentId)
        .map((c) => ({ ...c, decedents: this.getDecedents(c) }));
    },
    isNotRoot() {
      return this.parentId !== undefined;
    },
  },
  methods: {
    getDecedents(container) {
      const children = this.containers.filter((c) => c.parentContainerID === container.id);
      const grandchildren = children.flatMap((c) => this.getDecedents(c));
      console.log("children", children);
      return [...children, ...grandchildren];
    },
    navigateToContainer(containerId) {
      this.$router.push(`/containers/${containerId}`);
    },
  },
};
</script>

<style scoped>
.recursive-container-list.not-root {
  margin-left: 1.5rem;
}
</style>
