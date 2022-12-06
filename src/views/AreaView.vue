<template>
  <div class="area-view" v-if="area">
    <div class="header">
      <span>
        <h2>{{ area.name }}</h2>
        <span class="subtitle">Area</span>
      </span>
      <button @click="deleteArea(area.id)">
        Delete
      </button>
    </div>

    <div class="label">Containers</div>
    <ul class="data">
      <li v-for="container in containersForArea" :key="container.id">
        <ContainerLink :container="container" />
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ContainerLink from "../components/ContainerLink.vue";

export default {
  name: "AreaView",
  components: { ContainerLink },
  props: {
    areaId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters(["areas", "containers"]),
    area() {
      return this.areas.find((c) => c.id === this.areaId);
    },
    containersForArea() {
      return this.containers.filter((c) => c.areaID === this.areaId);
    },
  },
  methods: {
    ...mapActions(["deleteArea"]),
  },
};
</script>

<style>
.header {
  display: grid;
  grid-template-columns: 1fr auto;
  margin-bottom: 2rem;
}

h2 {
  line-height: 0rem;
}

.subtitle {
  color: gray;
}
</style>
