<template>
  <n-data-table
    :columns="columns"
    :data="containersData"
    :pagination="false"
    :bordered="false"
    default-expand-all
  />
</template>

<script>
import { mapGetters } from "vuex";
import { NDataTable, NButton } from "naive-ui";
import { h } from "vue";

export default {
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
      columns: this.createColumns((id) => this.$emit("editContainer", id)),
    };
  },
  computed: {
    ...mapGetters(["containers", "items"]),
    containersData() {
      return this.containers
        .filter((c) => !c.parentContainerID)
        .map((c) => this.containerDataRecursive(c))
        .filter((c) => c);
    },
  },
  methods: {
    containerDataRecursive(container) {
      const children = container.children
        .map((c) => this.containerDataRecursive(c))
        .filter((c) => c);
      const matchesQuery =
        children.length || container.name.toLowerCase().includes(this.query.toLowerCase());
      return matchesQuery
        ? {
            name: container.name,
            id: container.id,
            key: container.id,
            items: this.items.filter((i) => i.containerID === container.id).length,
            children: children,
          }
        : null;
    },
    createColumns(editAction) {
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
