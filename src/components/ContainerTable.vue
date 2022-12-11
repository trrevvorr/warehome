<template>
  <n-data-table
    :columns="columns"
    :data="containersData"
    :pagination="false"
    :bordered="false"
    :default-expand-all="containersData.length < 2 || containers.length < 10"
  />
  <n-modal v-model:show="showItemsModal" class="modal">
    <items-list :containerId="itemsModalContainerId" />
  </n-modal>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { NDataTable, NModal, NButton, DataTableColumns, NIcon } from "naive-ui";
import { defineComponent, h } from "vue";
import { Container, Item } from "@/models";
import { RowData } from "naive-ui/es/data-table/src/interface";
import { Edit16Regular } from "@vicons/fluent";
import ItemsList from "./ItemsList.vue";

export default defineComponent({
  name: "ContainerTable",
  emits: ["editContainer"],
  components: { NDataTable, NModal, ItemsList },
  props: {
    query: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      itemsModalContainerId: "",
      columns: this.createColumns(
        (id: string) => this.$emit("editContainer", id),
        this.setItemModalContainerId
      ),
      showItemsModal: false,
    };
  },
  watch: {
    showItemsModal(newShowItemsModal: boolean) {
      if (!newShowItemsModal) {
        this.itemsModalContainerId = "";
      }
    },
    itemsModalContainerId(newItemsModalContainerId: string) {
      if (newItemsModalContainerId) {
        this.showItemsModal = true;
      } else {
        this.showItemsModal = false;
      }
    },
  },
  computed: {
    ...mapGetters([
      "containers",
      "items",
      "getChildrenForContainer",
      "getDescendantsForContainer",
      "getItemsForContainer",
    ]),
    containersData() {
      return this.containers
        .filter((c: Container) => !c.parentContainerID)
        .map((c: Container) => this.containerDataRecursive(c))
        .filter((c: Container) => c);
    },
  },
  methods: {
    containerDataRecursive(container: Container) {
      const searchMatches = container.name.toLowerCase().includes(this.query.toLowerCase());
      if (searchMatches) {
        const children = this.getChildrenForContainer(container.id)
          .map((c: Container) => this.containerDataRecursive(c))
          .filter((c: Container) => c);
        const itemsCount = this.items.filter((i: Item) => i.containerID === container.id).length;
        const decedentItemsCount = this.getDescendantsForContainer(container.id).flatMap(
          (c: Container) => this.getItemsForContainer(c.id)
        ).length;
        return {
          name: container.name,
          id: container.id,
          key: container.id,
          itemsCount: `${itemsCount}${
            children.length ? " / " + (itemsCount + decedentItemsCount) : ""
          }`,
          children: children,
        };
      }

      return null;
    },
    createColumns(
      // eslint-disable-next-line no-unused-vars
      editAction: (id: string) => void,
      // eslint-disable-next-line no-unused-vars
      setItemModalContainerId: (id: string) => void
    ): DataTableColumns {
      return [
        {
          title: "Name",
          key: "name",
        },
        {
          title: "Items",
          key: "items",
          render(row: RowData) {
            return h(
              NButton,
              {
                quaternary: true,
                onClick: () => setItemModalContainerId(row.id),
              },
              { default: () => row.itemsCount }
            );
          },
        },
        {
          title: "Edit",
          key: "actions",
          render(row: RowData) {
            return h(
              NButton,
              {
                quaternary: true,
                onClick: () => editAction(row.id),
              },
              { icon: () => h(NIcon, {}, { default: () => h(Edit16Regular) }) }
            );
          },
        },
      ];
    },
    setItemModalContainerId(id: string) {
      this.itemsModalContainerId = id;
    },
  },
});
</script>

<style scoped></style>

<style scoped>
.modal {
  margin: auto;
  width: calc(100vw - 2rem);
  max-width: 30rem;
}
</style>
