<template>
  <h2>Container</h2>
  <div class="form">
    <label for="container-name-input">Name</label>
    <input id="container-name-input" type="text" v-model="newContainerName" />

    <label for="container-parentContainer-select">Parent Container</label>
    <container-select
      :value="parentContainerId"
      @selectOption="(val) => (parentContainerId = val)"
    />

    <span></span>
    <div>
      <button @click="resetForm">Reset</button>
      <button
        @click="addNewContainer"
        :disabled="!newContainerName || loading"
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
import ContainerSelect from "../components/ContainerSelect.vue";

export default {
  name: "ContainerForm",
  components: { ContainerList, ContainerSelect },
  data() {
    return {
      newContainerName: "",
      parentContainerId: "",
      loading: false,
    };
  },
  computed: {
    ...mapGetters(["containers"]),
  },
  methods: {
    ...mapActions(["addContainer", "deleteContainer"]),
    async addNewContainer() {
      this.loading = true;
      await this.addContainer({
        name: this.newContainerName,
        parentContainerId: this.parentContainerId,
      });
      this.resetForm();
      this.loading = false;
    },
    resetForm() {
      this.newContainerName = "";
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
