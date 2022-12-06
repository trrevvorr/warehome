<template>
  <div class="container-list">
    <div v-for="container in containers" :key="container.id" :class="{container: true, root: container.ancestors.containers.length === 0}" >
      <ContainerLink :container="container" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ContainerLink from "./ContainerLink.vue";

export default {
  name: "ContainerList",
  components: { ContainerLink },
  computed: {
    ...mapGetters(["containers"]),
  },
  methods: {
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

.container.root {
  margin-top: 1rem;
}
</style>
