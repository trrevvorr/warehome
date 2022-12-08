<template>
  <div class="header">
    <h2>Containers</h2>
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
      <n-card title="New Container" :bordered="false" role="dialog" aria-modal="true">
        <NewContainerForm @formSubmitted="showModal = false" />
      </n-card>
    </n-modal>
  </div>

  <container-table :query="query" />
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import NewContainerForm from "../components/NewContainerForm.vue";
import { Search12Regular, Add12Regular } from "@vicons/fluent";
import { markRaw } from "vue";
import { NModal, NCard, NIcon, NInput, NButton } from "naive-ui";
import ContainerTable from "../components/ContainerTable.vue";

export default {
  name: "ContainerForm",
  components: {
    NewContainerForm,
    NModal,
    NCard,
    NIcon,
    NInput,
    NButton,
    ContainerTable,
    Add12Regular,
  },
  data() {
    return {
      query: "",
      showModal: false,
      formValue: {
        name: "",
        parent: "",
      },
      rules: {
        name: {
          required: true,
          message: "Please input new container name",
          trigger: "blur",
        },
        parent: {
          required: false,
          message: "Please input your age",
          trigger: ["input", "blur"],
        },
      },
      Search12Regular: markRaw(Search12Regular),
    };
  },
  computed: {
    ...mapGetters(["containers"]),
    filteredContainers() {
      return this.containers.filter((c) => c.name.toLowerCase().includes(this.query.toLowerCase()));
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
