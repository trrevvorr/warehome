<template>
  <n-data-table
    :columns="columns"
    :data="containersData"
    :pagination="false"
    :bordered="false"
    :default-expand-all="containersData.length < 2 || containers.length < 10"
  />
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { NDataTable, NButton, DataTableColumns, NIcon } from "naive-ui";
import { defineComponent, h } from "vue";
import { Container, Item } from "@/models";
import { RowData } from "naive-ui/es/data-table/src/interface";
import { Edit16Regular } from "@vicons/fluent";

export default defineComponent({
  name: "ContainerTable",
  emits: ["editContainer"],
  components: { NDataTable },
  props: {
    query: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      columns: this.createColumns((id: string) => this.$emit("editContainer", id)),
    };
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
          items: `${itemsCount}${children.length ? " / " + decedentItemsCount : ""}`,
          children: children,
        };
      }

      return null;
    },
    // eslint-disable-next-line no-unused-vars
    createColumns(editAction: (id: string) => void): DataTableColumns {
      return [
        {
          title: "Name",
          key: "name",
        },
        {
          title: "Items",
          key: "items",
        },
        {
          title: "",
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
  },
});
</script>

<style scoped></style>
