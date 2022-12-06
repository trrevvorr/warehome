<template>
  <div class="container-list">
    <div v-for="container in containers" :key="container.id" :class="{container: true, root: container.ancestors.containers.length === 0}" >
      <span>
        <span class="ancestors">{{container.ancestors.asString}}</span>
        <span class="container-name">{{container.name}}</span>
      </span>
      <span>
        <button v-if="!container.children.length" @click="deleteContainer(container.id)">Delete</button>
      </span>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "ContainerList",
  computed: {
    ...mapGetters(["containers"]),
  },
  methods: {
    ...mapActions(["deleteContainer"]),
  },
};
</script>

<style scoped>
button {
  margin-left: 10px;
}
.ancestors {
  color: #b1b1b1;
}
.container {
  display: grid;
  grid-template-columns: 1fr auto;
}

.container.root {
  margin-top: 1rem;
}
</style>
