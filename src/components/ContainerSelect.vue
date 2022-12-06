<template>
  <n-tree-select
    filterable
    :options="options"
    clearable
    :value="value"
    @update:value="handleChange"
    :disabled="disabled"
  />
</template>

<script>
import { NTreeSelect } from "naive-ui";
import { mapGetters } from "vuex";

export default {
  name: "ContainerSelect",
  components: { NTreeSelect },
  emits: ["selectOption"],
  props: {
    value: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["containers"]),
    options() {
      const rootContainers = this.containers.filter((c) => c.parentContainerID === null);
      const areas = {};

      // add areas
      rootContainers.forEach((c) => {
        if (c.ancestors.area) {
          areas[c.ancestors.area.id] = c.ancestors.area;
        }
      });
      const options = Object.values(areas).map((area) => ({
        label: area.name,
        key: area.id,
        disabled: true,
        children: this.containersOptionsRecursive(
          rootContainers.filter((c) => c.areaID === area.id)
        ),
      }));

      // add root containers without area
      const rootContainersWithoutAreas = rootContainers.filter((c) => c.areaID === null);
      if (rootContainersWithoutAreas.length) {
        options.push({
          label: "No Area",
          key: "no-area",
          disabled: true,
          children: this.containersOptionsRecursive(rootContainersWithoutAreas),
        });
      }

      return options;
    },
  },
  methods: {
    containersOptionsRecursive(containers, root) {
      const options = containers.map((container) => ({
        label: container.name,
        key: container.id,
        type: root ? "group" : false,
        children: this.containersOptionsRecursive(container.children),
      }));

      return options.length ? options : undefined;
    },
    handleChange(value) {
      this.$emit("selectOption", value);
    },
  },
};
</script>

<style scoped></style>
