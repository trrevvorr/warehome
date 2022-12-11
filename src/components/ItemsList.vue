<template>
  <n-card
    v-if="containerId"
    :title="`Items in ${container.name}`"
    :bordered="false"
    role="dialog"
    aria-modal="true"
  >
    <n-tabs type="line" animated>
      <n-tab-pane
        name="all"
        :tab="`All Items (${[...itemsInContainer, ...itemsInDescendants].length})`"
      >
        <n-list :show-divider="false">
          <div v-if="[...itemsInContainer, ...itemsInDescendants].length" class="items-list">
            <n-list-item
              v-for="item in [...itemsInContainer, ...itemsInDescendants]"
              :key="item.id"
            >
              <n-thing :title="item.name" />
            </n-list-item>
          </div>
          <n-empty v-else description="No Items" />
          <template #footer>
            <n-text class="list-description" depth="3"
              >Displaying items in {{ container.name }} and its descendant containers</n-text
            >
          </template>
        </n-list>
      </n-tab-pane>
      <n-tab-pane name="container" :tab="`Direct Items Only (${itemsInContainer.length})`">
        <n-list :show-divider="false">
          <div v-if="itemsInContainer.length" class="items-list">
            <n-list-item v-for="item in itemsInContainer" :key="item.id">
              <n-thing :title="item.name" />
            </n-list-item>
          </div>
          <n-empty v-else description="No Items" />
          <template #footer>
            <n-text class="list-description" depth="3"
              >Displaying items directly in {{ container.name }} container
            </n-text>
          </template>
        </n-list>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { NCard, NEmpty, NList, NListItem, NThing, NText, NTabs, NTabPane } from "naive-ui";
import { defineComponent } from "vue";
import { Container } from "@/models";

export default defineComponent({
  name: "ItemsList",
  components: { NCard, NEmpty, NList, NListItem, NThing, NText, NTabs, NTabPane },
  props: {
    containerId: {
      type: String,
      required: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters([
      "getDescendantsForContainer",
      "getItemsForContainer",
      "containers",
      "getChildrenForContainer",
    ]),
    container() {
      console.log("containerId", this.containerId);
      return this.containerId && this.containers.find((c: Container) => c.id === this.containerId);
    },
    itemsInContainer() {
      return this.containerId && this.getItemsForContainer(this.containerId);
    },
    childContainers() {
      return this.getChildrenForContainer(this.containerId);
    },
    itemsInDescendants() {
      return (
        this.containerId &&
        this.getDescendantsForContainer(this.containerId).flatMap((c: Container) =>
          this.getItemsForContainer(c.id)
        )
      );
    },
  },
});
</script>

<style scoped>
.list-description {
  text-align: center;
  width: 100%;
  display: block;
}
.items-list {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
