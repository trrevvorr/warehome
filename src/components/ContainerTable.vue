<template>
  <n-data-table
    :columns="columns"
    :data="containersData"
    :pagination="false"
    :bordered="false"
    default-expand-all
  />
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { NDataTable, NButton, DataTableColumns } from "naive-ui";
import { defineComponent, h } from "vue";
import { Container, Item } from "@/models";
import { RowData } from "naive-ui/es/data-table/src/interface";

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
    ...mapGetters(["containers", "items", "getChildrenForContainer"]),
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
        const children = this.getChildrenForContainer(container)
          .map((c: Container) => this.containerDataRecursive(c))
          .filter((c: Container) => c);

        return {
          name: container.name,
          id: container.id,
          key: container.id,
          items: this.items.filter((i: Item) => i.containerID === container.id).length,
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
                strong: true,
                tertiary: true,
                size: "small",
                onClick: () => editAction(row.id),
              },
              { default: () => "Edit" }
            );
          },
        },
      ];
    },
  },
});
</script>

<style scoped></style>
