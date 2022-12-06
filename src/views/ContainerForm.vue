<template>
  <h2>Container</h2>
  <div class="form">
    <label for="container-name-input">Name</label>
    <input id="container-name-input" type="text" v-model="newContainerName" />

    <label for="container-parentContainer-select">Parent Container</label>
    <select id="container-parentContainer-select" v-model="parentContainerId" :disabled="!!areaId">
      <option v-for="container in containers" :key="container.id" :value="container.id">
        {{ container.ancestors.asString + container.name }}
      </option>
    </select>

    <label for="container-area-select">Area</label>
    <select id="container-area-select" v-model="areaId" :disabled="!!parentContainerId">
      <option v-for="area in areas" :key="area.id" :value="area.id">{{ area.name }}</option>
    </select>

    <span></span>
    <div>
      <button @click="resetForm">Reset</button>
      <button
        @click="addNewContainer"
        :disabled="!newContainerName || !(!!parentContainerId ^ !!areaId) || loading"
      >
        Create Container
      </button>
    </div>
  </div>

  <h2>Containers</h2>
  <ContainerList />
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ContainerList from "../components/ContainerList.vue";

export default {
  name: "ContainerForm",
  components: { ContainerList },
  data() {
    return {
      newContainerName: "",
      areaId: "",
      parentContainerId: "",
      loading: false,
    };
  },
  computed: {
    ...mapGetters(["containers", "areas"]),
  },
  methods: {
    ...mapActions(["addContainer", "deleteContainer"]),
    async addNewContainer() {
      this.loading = true;
      await this.addContainer({
        name: this.newContainerName,
        areaId: this.areaId,
        parentContainerId: this.parentContainerId,
      });
      this.resetForm();
      this.loading = false;
    },
    resetForm() {
      this.newContainerName = "";
      this.areaId = "";
      this.parentContainerId = "";
    },
  },
};
</script>

<style>
.form {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  max-width: 30rem;
}

.container-list li {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 1rem;
}

button {
  display: inline-block;
}
</style>
