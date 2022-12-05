<template>
  <div class="container-list-recursive">
    <div class="container-root list-row" v-for="container in containers" :key="container.id">
      <span>/ {{container.name}}</span>
      <ContainerListRecursive v-if="container.children.length" :containers="container.children" />
      <button v-else @click="deleteContainer(container.id)">Delete</button>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "ContainerListRecursive",
  props: {
    containers: {
      type: Array,
      required: true,
    },
  },
  methods: {
    ...mapActions(["deleteContainer"]),
  },
};
</script>

<style>
.container-list-recursive {
  margin-left: 2rem;
}
button {
  margin-left: 10px;
}
</style>
