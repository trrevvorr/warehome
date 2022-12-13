<template>
  <n-data-table :columns="columns" :data="locationsData" :pagination="false" :bordered="false" />
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { NDataTable, NButton, DataTableColumns, NIcon, NSpace } from "naive-ui";
import { defineComponent, h } from "vue";
import { Location } from "@/models";
import { RowData } from "naive-ui/es/data-table/src/interface";
import { Edit16Regular, Star12Filled, Star12Regular } from "@vicons/fluent";

export default defineComponent({
  name: "LocationTable",
  emits: ["editLocation", "activateLocation"],
  components: { NDataTable },
  props: {
    query: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      columns: [] as DataTableColumns,
    };
  },
  created() {
    this.columns = this.createColumns(
      (id: string) => this.$emit("editLocation", id),
      (id: string) => this.$emit("activateLocation", id),
      (id: string) => id === this.location?.id
    );
  },
  computed: {
    ...mapGetters(["locations", "location"]),
    locationsData() {
      return this.locations
        .filter((location: Location) =>
          location.name.toLowerCase().includes(this.query.toLowerCase())
        )
        .map((location: Location) => {
          return {
            name: location.name,
            id: location.id,
          };
        });
    },
  },
  methods: {
    createColumns(
      // eslint-disable-next-line no-unused-vars
      editAction: (id: string) => void,
      // eslint-disable-next-line no-unused-vars
      activateAction: (id: string) => void,
      // eslint-disable-next-line no-unused-vars
      isActive: (id: string) => boolean
    ): DataTableColumns {
      return [
        {
          title: "Name",
          key: "name",
          sorter: "default",
        },
        {
          title: "Actions",
          key: "actions",
          render(row: RowData) {
            return h(
              NSpace,
              {},
              {
                default: () => [
                  h(
                    NButton,
                    {
                      quaternary: true,
                      onClick: () => editAction(row.id),
                    },
                    { icon: () => h(NIcon, {}, { default: () => h(Edit16Regular) }) }
                  ),
                  h(
                    NButton,
                    {
                      quaternary: true,
                      onClick: () => activateAction(row.id),
                      disabled: isActive(row.id),
                      type: "warning",
                    },
                    {
                      icon: () =>
                        h(
                          NIcon,
                          {},
                          { default: () => h(isActive(row.id) ? Star12Filled : Star12Regular) }
                        ),
                    }
                  ),
                ],
              }
            );
          },
        },
      ];
    },
  },
});
</script>

<style scoped></style>
