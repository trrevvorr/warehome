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
      :default-expanded-keys="defaultExpandedKeys"
    />
    <n-button
      strong
      :disabled="!lastSelectedContainerId"
      @click="handleChange(lastSelectedContainerId)"
    >
      <template #icon>
        <n-icon><ClockToolbox24Regular /></n-icon>
      </template>
    </n-button>
  </div>
</template>

<script lang="ts">
import { NTreeSelect, NButton, NIcon, TreeSelectOption } from "naive-ui";
import { mapGetters, mapMutations } from "vuex";
import { ClockToolbox24Regular } from "@vicons/fluent";
import { Container } from "@/models";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ContainerSelect",
  components: { NTreeSelect, NButton, NIcon, ClockToolbox24Regular },
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
    selectLeafNodesOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters([
      "containers",
      "lastSelectedContainerId",
      "getChildrenForContainer",
      "getAncestorsForContainer",
    ]),
    options() {
      const rootContainers = this.containers.filter((c: Container) => c.parentContainerID === null);
      return this.containersOptionsRecursive(rootContainers) || [];
    },
    defaultExpandedKeys() {
      const selectedContainer = this.value
        ? this.containers.find((c: Container) => c.id === this.value)
        : null;
      return selectedContainer
        ? this.getAncestorsForContainer(selectedContainer).map((ancestor: Container) => ancestor.id)
        : [];
    },
  },
  methods: {
    ...mapMutations(["updateLastSelectedContainerId"]),
    containersOptionsRecursive(containers: Container[]): TreeSelectOption[] {
      const options = containers.map((container) => {
        const children = this.containersOptionsRecursive(this.getChildrenForContainer(container));
        return {
          label: container.name,
          key: container.id,
          children: children.length ? children : undefined,
          disabled: this.selectLeafNodesOnly && children && children.length > 0,
        };
      });

      return options;
    },
    handleChange(value: string) {
      this.updateLastSelectedContainerId(value);
      this.$emit("selectOption", value);
    },
  },
});
</script>

<style scoped>
.container-select {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: 1rem;
  width: 100%;
}
</style>
