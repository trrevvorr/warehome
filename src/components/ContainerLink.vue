<template>
  <span class="container-link">
    <span v-if="displayAncestors" class="ancestors">
      <span>{{ getAncestorStringForContainer(container) }}</span>
    </span>
    <router-link class="container-name" :to="'/containers/' + container.id">{{
      container.name || container.id
    }}</router-link>
  </span>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "ContainerLink",
  props: {
    container: {
      type: Object,
      required: true,
    },
    displayAncestors: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapGetters(["getAncestorStringForContainer"]),
  },
};
</script>

<style scoped>
.ancestors {
  color: #b1b1b1;
}

.container.root {
  margin-top: 1rem;
}
</style>
