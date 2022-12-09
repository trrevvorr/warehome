<template>
  <div class="container-select">
    <n-tree-select
      filterable
      :options="options"
      clearable
      :value="value"
      @update:value="handleChange"
      :disabled="disabled"
      show-path
      />
      <n-button strong :disabled="!lastSelectedContainerId" @click="handleChange(lastSelectedContainerId)">
      <template #icon>
        <n-icon><ClockToolbox24Regular /></n-icon>
      </template>
    </n-button>
  </div>
</template>

<script>
import { NTreeSelect, NButton, NIcon} from "naive-ui";
import { mapGetters, mapMutations } from "vuex";
import { ClockToolbox24Regular } from "@vicons/fluent";

export default {
  name: "ContainerSelect",
  components: { NTreeSelect, NButton, NIcon, ClockToolbox24Regular},
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
    ...mapGetters(["containers", "lastSelectedContainerId"]),
    options() {
      const rootContainers = this.containers.filter((c) => c.parentContainerID === null);
      return this.containersOptionsRecursive(rootContainers);
    },
  },
  methods: {
    ...mapMutations(["updateLastSelectedContainerId"]),
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
      this.updateLastSelectedContainerId(value);
      this.$emit("selectOption", value);
    },
  },
};
</script>

<style scoped>
.container-select {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: 1rem;
  width: 100%;
}
</style>
