<template>
  <div class="container-select">
    <n-space vertical>
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
      <div class="recent-containers-wrapper-wrapper">
        <n-icon size="25" class="recent-icon">
          <Clock16Regular />
        </n-icon>
        <div class="recent-containers-wrapper">
          <div class="recent-containers">
            <n-button
              v-for="container in getRecentContainers(3, value)"
              :key="container.id"
              quaternary
              @click="handleChange(container.id)"
            >
              {{ container.name }}
            </n-button>
          </div>
        </div>
      </div>
    </n-space>
  </div>
</template>

<script lang="ts">
import { NTreeSelect, NButton, NSpace, NIcon, TreeSelectOption } from "naive-ui";
import { mapGetters, mapMutations } from "vuex";
import { Clock16Regular } from "@vicons/fluent";
import { Container } from "@/models";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ContainerSelect",
  components: { NTreeSelect, NButton, NSpace, NIcon, Clock16Regular },
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
      "getRecentContainers",
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
    ...mapMutations(["addSelectedContainerId"]),
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
      this.addSelectedContainerId(value);
      this.$emit("selectOption", value);
    },
  },
});
</script>

<style scoped>
.container-select {
  width: 100%;
}

.recent-containers-wrapper-wrapper,
.recent-containers-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
  overflow-x: hidden;
}
.recent-containers {
  overflow-x: scroll;
  display: flex;
}

.recent-containers-wrapper:after {
  content: "";
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0), #2c2c31 85%);
  width: 1rem;
}
.recent-containers:before {
  content: "";
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  bottom: 0;
  pointer-events: none;
  background-image: linear-gradient(to left, rgba(255, 255, 255, 0), #2c2c31 85%);
  width: 1rem;
}
.recent-containers::-webkit-scrollbar {
  display: none;
}
</style>
