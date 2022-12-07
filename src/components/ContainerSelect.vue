<template>
  <n-tree-select
    filterable
    :options="options"
    clearable
    :value="value"
    @update:value="handleChange"
    :disabled="disabled"
    show-path
    />
</template>

<script>
import { NTreeSelect} from "naive-ui";
import { mapGetters } from "vuex";

export default {
  name: "ContainerSelect",
  components: { NTreeSelect},
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
      return this.containersOptionsRecursive(rootContainers);
    },
  },
  methods: {
    containersOptionsRecursive(containers) {
      const options = containers
      .map((container) => ({
        label: container.name,
        key: container.id,
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
