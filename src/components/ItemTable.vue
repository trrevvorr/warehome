<template>
  <n-data-table :columns="columns" :data="itemsData" :pagination="false" :bordered="false" />
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { NDataTable, NButton, DataTableColumns } from "naive-ui";
import { defineComponent, h } from "vue";
import { Item } from "@/models";
import { RowData } from "naive-ui/es/data-table/src/interface";

export default defineComponent({
  name: "ItemTable",
  emits: ["editItem"],
  components: { NDataTable },
  props: {
    query: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      columns: this.createColumns((id: string) => this.$emit("editItem", id)),
    };
  },
  computed: {
    ...mapGetters(["items", "getAncestorStringForContainer", "getContainerForItem"]),
    itemsData() {
      return this.items
        .filter((item: Item) => item.name.toLowerCase().includes(this.query.toLowerCase()))
        .map((item: Item) => {
          const container = this.getContainerForItem(item);
          return {
            name: item.name,
            container: container
              ? [this.getAncestorStringForContainer(container), container.name]
                  .filter((c) => c)
                  .join(" / ")
              : undefined,
            id: item.id,
          };
        });
    },
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    createColumns(editAction: (id: string) => void): DataTableColumns {
      return [
        {
          title: "Name",
          key: "name",
          sorter: "default",
        },
        {
          title: "Container",
          key: "container",
          sorter: "default",
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
