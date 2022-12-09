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
    <n-button @click="showModal = true">
      <template #icon>
        <n-icon><Add12Regular /></n-icon>
      </template>
    </n-button>
    <n-modal v-model:show="showModal" class="modal">
      <put-container-form @formSubmitted="showModal = false" :container="editContainer" />
    </n-modal>
  </div>

  <container-table :query="query" @editContainer="(id) => (editContainerId = id)" />
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import PutContainerForm from "../components/PutContainerForm.vue";
import { Search12Regular, Add12Regular } from "@vicons/fluent";
import { markRaw } from "vue";
import { NModal, NIcon, NInput, NButton, NH2, NText } from "naive-ui";
import ContainerTable from "../components/ContainerTable.vue";

export default {
  name: "ContainerForm",
  components: {
    PutContainerForm,
    NModal,
    NIcon,
    NInput,
    NButton,
    NH2,
    NText,
    ContainerTable,
    Add12Regular,
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
      return this.containers.filter((c) => c.name.toLowerCase().includes(this.query.toLowerCase()));
    },
    editContainer() {
      return this.editContainerId
        ? this.containers.find((c) => c.id === this.editContainerId)
        : null;
    },
  },
  methods: {
    ...mapActions(["addContainer", "deleteContainer"]),
  },
};
</script>

<style scoped>
.modal {
  margin: 1rem;
}

.header {
  line-height: 1rem;
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  grid-gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
}
</style>
