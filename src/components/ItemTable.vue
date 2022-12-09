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
      default: ''
    }
  },
  data() {
    return {
      columns: this.createColumns((id) => this.$emit("editItem", id)),
    };
  },
  computed: {
    ...mapGetters(["items"]),
    itemsData() {
      return this.items
        .filter((item) => item.name.toLowerCase().includes(this.query.toLowerCase()))
        .map((item) => ({
          name: item.name,
          container: item.container
            ? item.container.ancestors.asString + item.container.name
            : undefined,
          id: item.id,
        }));
    },
  },
  methods: {
    createColumns(editAction) {
      return [
        {
          title: "Name",
          key: "name",
        },
        {
          title: "Container",
          key: "container",
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
