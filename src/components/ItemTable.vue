<template>
  <n-data-table :columns="columns" :data="itemsData" :pagination="false" :bordered="false" />
</template>

<script>
import { mapGetters } from "vuex";
import { NDataTable, NButton } from "naive-ui";
import { h } from "vue";

export default {
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
      columns: this.createColumns((id) => this.$emit("editItem", id)),
    };
  },
  computed: {
    ...mapGetters(["items", "getAncestorStringForContainer", "getContainerForItem"]),
    itemsData() {
      return this.items
        .filter((item) => item.name.toLowerCase().includes(this.query.toLowerCase()))
        .map((item) => {
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
    createColumns(editAction) {
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
          render(row) {
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
};
</script>

<style scoped></style>
