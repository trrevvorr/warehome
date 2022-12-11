<template>
  <div class="header">
    <n-h2>
      <n-text type="primary"> Containers </n-text>
    </n-h2>
    <span></span>
    <n-input v-model:value="query" placeholder="search containers" clearable>
      <template #prefix>
        <n-icon :component="Search12Regular" />
      </template>
    </n-input>
  </div>
  <n-button
    @click="showModal = true"
    class="new-container-button"
    circle
    type="primary"
    size="large"
  >
    <template #icon>
      <n-icon><Add16Filled /></n-icon>
    </template>
  </n-button>
  <n-modal v-model:show="showModal" class="modal">
    <put-container-form-wrapper @formSubmitted="showModal = false" :container="editContainer" />
  </n-modal>

  <container-table :query="query" @editContainer="(id) => (editContainerId = id)" />
</template>

<script lang="ts">
import { mapActions, mapGetters } from "vuex";
import PutContainerFormWrapper from "../components/PutContainerFormWrapper.vue";
import { Search12Regular, Add16Filled } from "@vicons/fluent";
import { defineComponent, markRaw } from "vue";
import { NModal, NIcon, NInput, NButton, NH2, NText } from "naive-ui";
import ContainerTable from "../components/ContainerTable.vue";
import { Container } from "@/models";

export default defineComponent({
  name: "ContainerForm",
  components: {
    PutContainerFormWrapper,
    NModal,
    NIcon,
    NInput,
    NButton,
    NH2,
    NText,
    ContainerTable,
    Add16Filled,
  },
  data() {
    return {
      query: "",
      showModal: false,
      editContainerId: "",
      Search12Regular: markRaw(Search12Regular),
    };
  },
  watch: {
    showModal(val) {
      if (!val) {
        this.editContainerId = "";
      }
    },
    editContainer(val) {
      if (val) {
        this.showModal = true;
      }
    },
  },
  computed: {
    ...mapGetters(["containers"]),
    filteredContainers() {
      return this.containers.filter((c: Container) =>
        c.name.toLowerCase().includes(this.query.toLowerCase())
      );
    },
    editContainer() {
      return this.editContainerId
        ? this.containers.find((c: Container) => c.id === this.editContainerId)
        : null;
    },
  },
  methods: {
    ...mapActions(["addContainer", "deleteContainer"]),
  },
});
</script>

<style scoped>
.modal {
  margin: 1rem;
}

.header {
  line-height: 1rem;
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
}

.new-container-button {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  z-index: 999;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}
</style>
